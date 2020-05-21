import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class BasketInput {
  @Field(type => [String])
  items?: string[];
}
