import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class EventCapacityInput {
  @Field()
  id: string;
}
