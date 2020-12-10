import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Guards } from '@common/guards';
import { SharedServices } from '@common/services';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { Strategies } from './strategies';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    SharedServices,
  ],
  providers: [AuthService, AuthResolver, ...Guards, ...Strategies],
  exports: [AuthService, ...Guards],
})
export class AuthModule {}
