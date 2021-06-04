import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(type => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  price: number;
}
