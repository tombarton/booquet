import { Field, ObjectType, Int } from '@nestjs/graphql';
import { PageInfo } from './page-info';
import { Type } from '@nestjs/common';

export default function Paginated<TItem>(TItemClass: Type<TItem>) {
  @ObjectType(`${TItemClass.name}Edge`)
  abstract class EdgeType {
    @Field(type => String)
    cursor: string;

    @Field(type => TItemClass)
    node?: TItem;
  }

  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(type => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(type => PageInfo)
    pageInfo: PageInfo;

    @Field(type => Int)
    totalCount: number;
  }
  return PaginatedType;
}
