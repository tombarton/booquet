import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards, BadRequestException } from '@nestjs/common';
import { GqlOptionalAuthGuard } from '@common/guards';
import { CurrentUser } from '@common/decorators';
import { User } from '@common/models/user';
import { StripeService } from './stripe.service';
import { BasketInput } from './dto/basket.input';
import { PaymentIntent } from './dto/payment-intent';

@Resolver(of => PaymentIntent)
@UseGuards(GqlOptionalAuthGuard)
export class StripeResolver {
  constructor(private readonly stripeService: StripeService) {}

  @Query(returns => PaymentIntent)
  async getIntent(
    @CurrentUser() user: User,
    @Args('data', { nullable: true }) basket: BasketInput
  ) {
    // We rely on either a client side basket being passed in, or a user being
    // authenticated. If we receive neither of these, then we throw a bad request
    // error.
    if (!user && !basket) {
      throw new BadRequestException(
        'You must provide a basket or be authenticated as a user.'
      );
    }

    const intentSecret = await this.stripeService.createPayment(basket);

    return {
      token: intentSecret,
    };
  }
}
