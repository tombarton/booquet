import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';

import { RolesGuard, GqlAuthGuard } from '@common/guards';
import { Order, OrderConnection } from '@common/models/order';
import { Roles } from '@common/decorators';
import { PrismaService } from '@common/services';
import { PaginationArgs } from '@common/pagination/pagination-args';
import { findManyOffset } from '@common/pagination/find-many';
import { OrderSort } from './dto/order-sort.input';

@Resolver(of => Order)
@UseGuards(GqlAuthGuard, RolesGuard)
export class OrderManagementResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Roles(Role.ADMIN)
  @Query(returns => OrderConnection)
  async getAllOrders(
    @Args() { limit, skip }: PaginationArgs,
    @Args({ name: 'sortBy', type: () => OrderSort, nullable: true })
    sortBy: OrderSort
  ) {
    return await findManyOffset(
      args =>
        this.prisma.order.findMany({
          include: { user: true, items: true },
          orderBy: sortBy ? { [sortBy.field]: sortBy.direction } : null,
          ...args,
        }),
      () => this.prisma.order.count(),
      { limit, skip }
    );
  }
}
