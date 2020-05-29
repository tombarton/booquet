import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import PaginatedResponse from '@common/pagination/pagination';
import { OrderItem } from './order-item';
import { OrderStatus } from '@prisma/client';
import { User } from './user';

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Order Status',
});

@ObjectType()
export class Order {
  @Field(type => ID)
  id: string;

  @Field(type => [OrderItem])
  items: OrderItem[];

  @Field()
  total: number;

  @Field(type => OrderStatus)
  status: OrderStatus;

  @Field({ nullable: true })
  chargeId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  user?: User;
}

@ObjectType()
export class OrderConnection extends PaginatedResponse(Order) {}
