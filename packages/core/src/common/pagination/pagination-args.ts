import { Field, ArgsType, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(type => Int, { nullable: true })
  limit?: number;

  @Field(type => Int, { nullable: true })
  skip?: number;
}
