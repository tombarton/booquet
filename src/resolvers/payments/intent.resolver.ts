import { Resolver, Query, Args } from '@nestjs/graphql';
import { StripeService } from '../../services/stripe.service';
import { PaymentIntent } from '../../models/payment-intent';
import { CurrentUser } from '../../decorators/user.decorator';
import { User } from '../../models/user';
import { BasketInput } from './dto/basket.input';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { GqlOptionalAuthGuard } from 'src/guards/gql-optional-auth.guard';

@Resolver(of => PaymentIntent)
@UseGuards(GqlOptionalAuthGuard)
export class IntentResolver {
  constructor(private stripeService: StripeService) {}

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

    const intentSecret = await this.stripeService.createPayment(basket, user);

    return {
      token: intentSecret,
    };
  }
}
