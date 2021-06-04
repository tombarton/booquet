import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeliveryCost {
  @Field({ description: 'Cost of delivery' })
  cost: number;
}
