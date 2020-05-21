import {
  Controller,
  Post,
  Body,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { Stripe } from 'stripe';
import { StripeGuard } from './stripe.guard';
import { StripeService } from './stripe.service';

@Controller('stripe')
@UseGuards(StripeGuard)
export class StripeWebhookContoller {
  constructor(private stripeService: StripeService) {}

  @Post('/webhook')
  handleStripeWebhook(@Body() body: Buffer) {
    let parsedBody: Stripe.Event;

    try {
      parsedBody = JSON.parse(body.toString('utf-8'));
    } catch (e) {
      throw new InternalServerErrorException(
        'Unable to parse Stripe webhook body.'
      );
    }

    // We don't await the promise here. It's going to run in the background
    // and we return the acknowledgement to Stripe ASAP. Any errors thrown
    // during the promise execution are on our part, nothing to do with Stripe.
    this.stripeService.handleWebhook(parsedBody);

    return { received: true };
  }
}
