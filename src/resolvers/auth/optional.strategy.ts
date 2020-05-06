import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtDto } from './dto/jwt.dto';
import { User } from '@prisma/client';
import { JwtFromRequest } from './jwt.strategy';

@Injectable()
export class OptionalStrategy extends PassportStrategy(Strategy, 'optional') {
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
      return null;
    }

    return user;
  }
}
