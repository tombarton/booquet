import { Module } from '@nestjs/common';
import { SharedServices } from '@common/services';

import { StripeResolver } from './stripe.resolver';
import { StripeWebhookContoller } from './stripe.controller';
import { StripeService } from './stripe.service';
import { StripeGuard } from './stripe.guard';

@Module({
  imports: [SharedServices],
  providers: [StripeService, StripeGuard, StripeResolver],
  controllers: [StripeWebhookContoller],
})
export class StripeModule {}
