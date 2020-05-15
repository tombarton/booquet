import { Module } from '@nestjs/common';
import { ProductsResolver } from './products.resolver';
import { SharedServices } from '@common/services';

@Module({
  imports: [SharedServices],
  providers: [ProductsResolver],
})
export class ProductsModule {}
