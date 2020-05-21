import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

import { EmailService } from './email.service';
import { PasswordService } from './password.service';
import { PrismaService } from './prisma.service';

const pubSub = {
  provide: 'PubSub',
  useFactory: (configService: ConfigService) => {
    const options = {
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
    };

    return new RedisPubSub({
      publisher: new Redis(options),
      subscriber: new Redis(options),
    });
  },
  inject: [ConfigService],
};

@Module({
  providers: [pubSub, EmailService, PasswordService, PrismaService],
  exports: [pubSub, EmailService, PasswordService, PrismaService],
})
export class SharedServices {}
export { EmailService, PasswordService, PrismaService };
