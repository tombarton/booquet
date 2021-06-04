import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class BasketItem {
  @Field()
  id: string;

  @Field()
  quantity: number;
}

@InputType()
export class BasketInput {
  @Field(() => [BasketItem], { nullable: true })
  @IsOptional()
  items?: BasketItem[];
}
