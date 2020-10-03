import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { isAfter, addHours } from 'date-fns';

import { SignupInput } from './dto/signup.input';
import { GraphQLContext } from '@root/types';
import { Role } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordInput } from './dto/reset-password.input';
import { EmailService, PrismaService, PasswordService } from '@common/services';

export enum Cookies {
  SIGNATURE = 'SIGNATURE',
  REFRESH = 'REFRESH',
}

interface JWT {
  header: string;
  payload: string;
  signature: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService
  ) {}

  async createUser(payload: SignupInput): Promise<Tokens> {
    const { autoLogin, ...signUpPayload } = payload;
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    try {
      const user = await this.prisma.user.create({
        data: {
          ...signUpPayload,
          password: hashedPassword,
          // All users are added with a standard role by default.
          // @TODO: Add the ability for admins to create other ADMIN roles.
          role: Role.USER,
        },
      });

      return await this.generateTokens(user);
    } catch (err) {
      throw new ConflictException(`Email ${payload.email} is already in use.`);
    }
  }

  async login(email: string, password: string): Promise<Tokens> {
    const user = await this.prisma.user.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`No user found for email ${email}`);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new ForbiddenException('Invalid password');
    }

    return await this.generateTokens(user);
  }

  async validateUser(userId: string) {
    return await this.prisma.user.findOne({ where: { id: userId } });
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findOne({ where: { id: userId } });
    const tokenMatch = await compare(refreshToken, user.refreshTokenHash);

    if (!tokenMatch) {
      throw new ForbiddenException('Invalid refresh token');
    }
    return user;
  }

  async getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    const user = await this.prisma.user.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`No user found for ID: ${id}`);
    }

    return user;
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.prisma.user.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`No user found for email ${email}`);
    }

    // Do not allow ADMIN users to reset their passwords.
    if (user.role === Role.ADMIN) {
      throw new ForbiddenException(
        `For security purposes, admin users cannot reset their passwords.`
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { email },
      data: {
        resetToken: await hash(randomBytes(32).toString('hex'), 10),
        resetTokenExpiry: addHours(new Date(), 2),
      },
    });

    const resetLink = `https://${
      this.configService.get('FE_URL') || 'booquet.dev'
    }/forgot-password?token=${updatedUser.resetToken}`;

    return this.emailService.sendPasswordResetEmail({
      name: user.firstname,
      email: user.email,
      url: resetLink,
    });
  }

  async resetPassword({
    resetTokenHash,
    newPassword,
  }: ResetPasswordInput): Promise<User> {
    const user = await this.prisma.user.findOne({
      where: { resetToken: resetTokenHash },
    });

    if (!user) {
      throw new UnauthorizedException('Unauthorized action attempted.');
    }

    if (!user.resetTokenExpiry || isAfter(new Date(), user.resetTokenExpiry)) {
      throw new UnauthorizedException('Reset token has expired.');
    }

    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
        password: await this.passwordService.hashPassword(newPassword),
      },
    });
  }

  setloginCookies(tokens: Partial<Tokens>, context: GraphQLContext) {
    return new Promise<void>(res => {
      Object.entries(tokens).forEach(([key, value]) => {
        switch (key) {
          case 'accessToken':
            // Extract signature from JWT.
            const signature = this.splitToken(value, ['signature']);
            context.res.cookie(Cookies.SIGNATURE, signature, {
              httpOnly: true,
            });
            break;
          case 'refreshToken':
            context.res.cookie(Cookies.REFRESH, value, {
              httpOnly: true,
            });
            break;
          default:
            console.warn('Key not found');
        }
      });

      return res();
    });
  }

  async generateTokens(user: User, storeRefreshToken = true): Promise<Tokens> {
    const { id, role, email } = user;
    const tokenPayload = { userId: id, role: role };

    const tokens = {
      accessToken: this.jwtService.sign(tokenPayload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRY'),
      }),
      refreshToken: this.jwtService.sign(tokenPayload, {
        secret: this.configService.get('REFRESH_SECRET'),
        expiresIn: this.configService.get('REFRESH_EXPIRY'),
      }),
    };

    if (storeRefreshToken) {
      await this.prisma.user.update({
        data: {
          refreshTokenHash: await hash(
            tokens.refreshToken,
            this.passwordService.bcryptSaltRounds
          ),
        },
        where: { email },
      });
    }

    return tokens;
  }

  clearLoginCookies(context: GraphQLContext) {
    return new Promise<void>(res => {
      context.res.clearCookie(Cookies.SIGNATURE);
      context.res.clearCookie(Cookies.REFRESH);

      return res();
    });
  }

  splitToken(jwt: string, parts?: Array<keyof JWT>) {
    const split = jwt.split('.');
    const token = { header: split[0], payload: split[1], signature: split[2] };

    return parts.map(i => `${token[`${i}`]}`).join('.');
  }
}
