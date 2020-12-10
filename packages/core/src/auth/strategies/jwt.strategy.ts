import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Request } from 'express';
import { JwtDto } from '../dto/jwt.dto';
import { Cookies, AuthService } from '../auth.service';

export const AUTH_HEADER = 'authorization';
export const TOKEN_RGX = /(\S+)\s+(\S+)/;

export const parseCookie = (cookie: string) =>
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {} as { [key: string]: any });

export const JwtFromRequest = (req: Request) => {
  let partialJwt: string;
  let signature: string;

  // Grab the authentication token from the header.
  if (req.headers[`${AUTH_HEADER}`]) {
    const header = req.headers[`${AUTH_HEADER}`];
    const partial = Array.isArray(header) ? header[0] : header;

    partialJwt = partial.match(TOKEN_RGX)[2];
  }

  // Grab the signature cookie from the request if present.
  // We split the JWT for security purposes and then piece them back together again here to avoid XSS.
  if (req?.cookies) {
    signature = req.cookies[Cookies.SIGNATURE];
  } else {
    // Fall back to headers if we can't retrieve them from the paser.
    const cookies = parseCookie(req.headers.cookie);
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
