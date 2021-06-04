import { Args, Resolver, Query } from '@nestjs/graphql';
import { DeliveryCost } from './dto/delivery-cost.dto';
import { LocationInput } from './dto/location.input';

@Resolver(() => DeliveryCost)
export class DeliveryResolver {
  @Query(() => DeliveryCost)
  async getDeliveryCost(
    @Args('data') input: LocationInput
  ): Promise<DeliveryCost> {
    console.log('INPUT: ', input);
    return Promise.resolve({ cost: 499 });
  }
}
