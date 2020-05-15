import { User } from '@prisma/client';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { isAfter, addHours } from 'date-fns';

import { SignupInput } from './dto/signup.input';
import { GraphQLContext } from '@root/types';
import { Role } from '@common/models/user';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordInput } from './dto/reset-password.input';
import { EmailService, PrismaService, PasswordService } from '@common/services';

export enum Cookies {
  SIGNATURE = 'SIGNATURE',
  PARTIAL_JWT = 'PARTIAL_JWT',
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

  async createUser(payload: SignupInput): Promise<string> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    try {
      const user = await this.prisma.user.create({
        data: {
          ...payload,
          password: hashedPassword,
          // All users are added with a standard role by default.
          // @TODO: Add the ability for admins to create other ADMIN roles.
          role: Role.USER,
        },
      });

      return this.jwtService.sign({ userId: user.id });
    } catch (err) {
      throw new ConflictException(`Email ${payload.email} is already in use.`);
    }
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.prisma.user.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`No user found for email ${email}`);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.jwtService.sign({ userId: user.id });
  }

  validateUser(userId: string): Promise<User> {
    return this.prisma.user.findOne({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prisma.user.findOne({ where: { id } });
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

  setloginCookies(jwt: string, context: GraphQLContext) {
    return new Promise<void>((res) => {
      const [header, payload, signature] = jwt.split('.');

      // Set signature httpOnly cookie.
      // @TODO: Need to set secure mode in production...
      context.res.cookie(Cookies.SIGNATURE, signature, {
        httpOnly: true,
      });

      // Set remainder of JWT as a standard cookie, accessible via JS.
      context.res.cookie(Cookies.PARTIAL_JWT, `${header}.${payload}`);

      return res();
    });
  }

  clearLoginCookies(context: GraphQLContext) {
    return new Promise<void>((res) => {
      context.res.clearCookie(Cookies.SIGNATURE);
      context.res.clearCookie(Cookies.PARTIAL_JWT);

      return res();
    });
  }
}
