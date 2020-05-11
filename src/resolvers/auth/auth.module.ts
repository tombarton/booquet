import { PrismaService } from './../../services/prisma.service';
import { PasswordService } from './../../services/password.service';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { GqlOptionalAuthGuard } from '../../guards/gql-optional-auth.guard';
import { AuthService } from '../../services/auth.service';
import { AuthResolver } from './auth.resolver';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../services/email.service';
import { RolesGuard } from '../../guards/role.guard';
import { OptionalStrategy } from './optional.strategy';
import { SocketGuard } from '../../guards/socket-guard';
import { SocketStrategy } from './socket-jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    OptionalStrategy,
    SocketStrategy,
    GqlAuthGuard,
    GqlOptionalAuthGuard,
    SocketGuard,
    RolesGuard,
    PasswordService,
    PrismaService,
    EmailService,
  ],
  exports: [GqlAuthGuard, GqlOptionalAuthGuard, SocketGuard, RolesGuard],
})
export class AuthModule {}
