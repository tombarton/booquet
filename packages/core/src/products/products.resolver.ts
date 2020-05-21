import { Product } from '@common/models/product';
import { Resolver, Query } from '@nestjs/graphql';
import { PrismaService } from '@common/services/prisma.service';

@Resolver(of => Product)
export class ProductsResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(returns => [Product])
  async getAllProducts(): Promise<Product[]> {
    return await this.prisma.product.findMany();
  }
}
