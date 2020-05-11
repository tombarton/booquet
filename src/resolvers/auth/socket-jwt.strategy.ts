import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtDto } from './dto/jwt.dto';
import { User } from '@prisma/client';
import { parseCookie } from './jwt.strategy';
import { WsException } from '@nestjs/websockets';
import { Request } from 'express';
import { Cookies } from '../../services/auth.service';
import { Handshake } from 'socket.io';

interface SocketRequest extends Request {
  handshake: Handshake;
}

@Injectable()
export class SocketStrategy extends PassportStrategy(Strategy, 'socket') {
  constructor(
    readonly authService: AuthService,
    readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: (req: SocketRequest) => {
        let partialJwt: string;
        let signature: string;

        // Grab cookie from socket handshake.
        if (req?.handshake?.headers?.cookie) {
          const cookies = parseCookie(req.handshake.headers.cookie);

          partialJwt = cookies[Cookies.PARTIAL_JWT];
          signature = cookies[Cookies.SIGNATURE];
        }

        return partialJwt && signature ? `${partialJwt}.${signature}` : null;
      },
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtDto): Promise<User> {
    const user = await this.authService.validateUser(payload.userId);

    if (!user) {
      throw new WsException('Unauthorized');
    }
    return user;
  }
}
