import { Module } from '@nestjs/common';
import { StripeWebhookContoller } from './stripe-webhook.controller';
import { StripeService } from '../../services/stripe.service';
import { StripeGuard } from '../../guards/stripe.guard';
import { PrismaService } from '../../services/prisma.service';

@Module({
  providers: [StripeService, StripeGuard, PrismaService],
  controllers: [StripeWebhookContoller],
  exports: [StripeGuard],
})
export class StripeWebhookModule {}
