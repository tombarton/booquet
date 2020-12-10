import { Module } from '@nestjs/common';
import { SharedServices } from '@common/services';
import { ProductsResolver } from './products.resolver';
import { EventsModule } from './events/events.module';

@Module({
  imports: [SharedServices, EventsModule],
  providers: [ProductsResolver],
})
export class ProductsModule {}
