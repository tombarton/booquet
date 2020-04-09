import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtDto } from './dto/jwt.dto';
import { User } from '@prisma/client';
import { Request } from 'express';

const parseCookie = (cookie: string) =>
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {} as { [key: string]: any });

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        let partialJwt: string;
        let signature: string;

        // Grab cookie from request if present.
        // We split the JWT in two for security purposes and then piece them back together again here.
        if (req?.cookies) {
          partialJwt = req.cookies['partialJwt'];
          signature = req.cookies['signature'];
        } else {
          // Fall back to headers if we can't retrieve them from the paser.
          const cookies = parseCookie(req.headers.cookie);
          partialJwt = cookies.partialJwt;
          signature = cookies.signature;
        }

        return partialJwt && signature ? `${partialJwt}.${signature}` : null;
      },
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtDto): Promise<User> {
    const user = await this.authService.validateUser(payload.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
