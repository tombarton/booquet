import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentIntent {
  @Field({ description: 'Payment Intent Token' })
  token: string;
}
