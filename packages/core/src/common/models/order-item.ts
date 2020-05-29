import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderItem {
  @Field(type => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  image: string;

  @Field()
  price: number;

  @Field()
  quantity: number;
}
