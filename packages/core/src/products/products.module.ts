import { Module } from '@nestjs/common';
import { ProductsResolver } from './products.resolver';
import { SharedServices } from '@common/services';
import { EventsModule } from './events/events.module';

@Module({
  imports: [SharedServices, EventsModule],
  providers: [ProductsResolver],
})
export class ProductsModule {}
