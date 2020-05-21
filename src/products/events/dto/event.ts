import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Event {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  totalCapacity: number;

  @Field()
  remainingCapacity: number;
}
