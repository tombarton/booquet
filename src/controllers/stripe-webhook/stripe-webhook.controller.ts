import {
  Controller,
  Post,
  Body,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { Stripe } from 'stripe';
import { StripeGuard } from 'src/guards/stripe.guard';
import { StripeService } from 'src/services/stripe.service';

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

    this.stripeService.handleWebhook(parsedBody);

    return { received: true };
  }
}
