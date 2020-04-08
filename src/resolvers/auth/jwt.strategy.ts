import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtDto } from './dto/jwt.dto';
import { User } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        let token = null;

        // Grab cookie from request if present.
        // We split the JWT in two for security purposes and then piece them back together again here.
        if (req?.cookies) {
          const partialJwt = req.cookies['partialJwt'];
          const signature = req.cookies['signature'];
          token = partialJwt && signature ? `${partialJwt}.${signature}` : null;
        }

        return token;
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
