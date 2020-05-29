import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import PaginatedResponse from '@common/pagination/pagination';
import { OrderItem } from './order-item';
import { User } from './user';

enum OrderStatusWithoutPending {
  AWAITING_CONFIRMATION = 'AWAITING_CONFIRMATION',
  AWAITING_FULFILLMENT = 'AWAITING_FULFILLMENT',
  FULFILLED = 'FULFILLED',
}

registerEnumType(OrderStatusWithoutPending, {
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

  @Field(type => OrderStatusWithoutPending)
  status: OrderStatusWithoutPending;

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
