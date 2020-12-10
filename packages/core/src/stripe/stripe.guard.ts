import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Stripe } from 'stripe';

@Injectable()
export class StripeGuard implements CanActivate {
  stripeAPI: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripeAPI = new Stripe(this.configService.get('STRIPE_API_KEY'), {
      apiVersion: '2020-08-27',
    });
  }

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const event = this.stripeAPI.webhooks.constructEvent(
        request.body,
        request.headers['stripe-signature'],
        this.configService.get('STRIPE_WEBHOOK_SECRET')
      );

      return true;
    } catch (e) {
      return false;
    }
  }
}
