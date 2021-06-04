import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LocationInput {
  @Field()
  longitude: number;
  @Field()
  latitude: number;
}
