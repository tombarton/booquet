import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  price: number;
}
