import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtDto } from '../dto/jwt.dto';
import { Request } from 'express';
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

export const RefreshTokenFromRequest = (req: Request) => {
  let refreshToken: string;

  // Grab the refresh cookie from the request if present.
  if (req?.cookies) {
    refreshToken = req.cookies[Cookies.REFRESH];
  } else {
    // Fall back to headers if we can't retrieve them from the paser.
    const cookies = parseCookie(req.headers.cookie);
    refreshToken = cookies[Cookies.REFRESH];
  }

  return refreshToken;
};

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  'refresh-token'
) {
  constructor(
    readonly authService: AuthService,
    readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: RefreshTokenFromRequest,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtDto) {
    const refreshToken = request.cookies[Cookies.REFRESH];
    const { userId } = payload;
    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
