import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtDto } from '../dto/jwt.dto';
import { User } from '@prisma/client';
import { Request } from 'express';
import { Cookies, AuthService } from '../auth.service';

export const parseCookie = (cookie: string) =>
  cookie
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {} as { [key: string]: any });

export const JwtFromRequest = (req: Request) => {
  let partialJwt: string;
  let signature: string;

  // Grab cookie from request if present.
  // We split the JWT in two for security purposes and then piece them back together again here.
  if (req?.cookies) {
    partialJwt = req.cookies[Cookies.PARTIAL_JWT];
    signature = req.cookies[Cookies.SIGNATURE];
  } else {
    // Fall back to headers if we can't retrieve them from the paser.
    const cookies = parseCookie(req.headers.cookie);
    partialJwt = cookies[Cookies.PARTIAL_JWT];
    signature = cookies[Cookies.SIGNATURE];
  }

  return partialJwt && signature ? `${partialJwt}.${signature}` : null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly authService: AuthService,
    readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: JwtFromRequest,
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
