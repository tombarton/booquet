import { InputType, registerEnumType, Field } from '@nestjs/graphql';
import { Sort } from '@common/sort';

export enum OrderSortField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

registerEnumType(OrderSortField, {
  name: 'OrderSortField',
});

@InputType()
export class OrderSort extends Sort {
  @Field(type => OrderSortField)
  field: OrderSortField;
}
