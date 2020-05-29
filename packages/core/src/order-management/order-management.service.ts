import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/services';

@Injectable()
export class OrderManagementService {
  constructor(private readonly prisma: PrismaService) {}

  retrieveAllOrders() {
    return this.prisma.order.findMany();
  }
}
