import { Module } from '@nestjs/common';
import { OrderManagementResolver } from './order-management.resolver';
import { OrderManagementService } from './order-management.service';
import { SharedServices } from '@common/services';

@Module({
  imports: [SharedServices],
  providers: [OrderManagementResolver, OrderManagementService],
})
export class OrderManagementModule {}
