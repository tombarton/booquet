import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum SortDirection {
  // Specifies an ascending order for a given `orderBy` argument.
  asc = 'asc',
  // Specifies a descending order for a given `orderBy` argument.
  desc = 'desc',
}

registerEnumType(SortDirection, {
  name: 'SortDirection',
});

@InputType({ isAbstract: true })
export abstract class Sort {
  @Field(type => SortDirection)
  direction: SortDirection;
}
