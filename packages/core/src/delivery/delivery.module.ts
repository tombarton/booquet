import { Module } from '@nestjs/common';
import { SharedServices } from '@common/services';
import { DeliveryResolver } from './delivery.resolver';
import { DeliveryService } from './delivery.service';

@Module({
  imports: [SharedServices],
  providers: [DeliveryResolver, DeliveryService],
})
export class DeliveryModule {}
