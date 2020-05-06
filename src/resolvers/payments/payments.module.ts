import { IntentResolver } from './intent.resolver';
import { Module } from '@nestjs/common';
import { StripeService } from '../../services/stripe.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  providers: [IntentResolver, StripeService, ConfigService, PrismaService],
})
export class PaymentsModule {}
