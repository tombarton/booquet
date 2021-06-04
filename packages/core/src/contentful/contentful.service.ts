import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createClient as createDeliveryClient,
  ContentfulClientApi as DeliveryClientAPI,
} from 'contentful';
import fetch from 'node-fetch';
import {
  createClient as createManagementClient,
  ClientAPI as ManagementClientAPI,
} from 'contentful-management';

import { PrismaService } from '@common/services/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ContentfulService {
  contentfulClient: DeliveryClientAPI;
  contentfulManagementClient: ManagementClientAPI;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService
  ) {
    this.contentfulClient = createDeliveryClient({
      space: this.configService.get('CONTENTFUL_SPACE'),
      accessToken: this.configService.get('CONTENTFUL_ACCESS_TOKEN'),
      environment: this.configService.get('CONTENTFUL_ENVIRONMENT'),
    });
    this.contentfulManagementClient = createManagementClient({
      accessToken: this.configService.get('CONTENTFUL_MANAGEMENT_TOKEN'),
    });
  }

  async updateProducts(): Promise<void> {
    const retrievedProducts = await this.fetchProductsFromGraphCMS();
    const retrievedProductIds = new Set(retrievedProducts.map(p => p.id));

    // Grab a local copy of all products.
    const existingProducts = await this.prismaService.product.findMany();

    const deletedProducts = existingProducts.filter(
      p => !retrievedProductIds.has(p.id)
    );

    // Create queries
    const deleteCartItemsQuery = deletedProducts.map(p =>
      this.prismaService.cartItem.deleteMany({ where: { productId: p.id } })
    );
    const deleteProductsQuery = deletedProducts.map(p =>
      this.prismaService.product.delete({ where: { id: p.id } })
    );
    const upsertProductsQuery = retrievedProducts.map(p =>
      this.prismaService.product.upsert({
        create: p,
        update: p,
        where: { id: p.id },
      })
    );

    // Execute queries as part of transaction.
    await this.prismaService.$transaction([
      ...deleteCartItemsQuery,
      ...deleteProductsQuery,
      ...upsertProductsQuery,
    ]);
  }

  async fetchProductsFromGraphCMS(): Promise<Product[]> {
    try {
      const query = `
        query {
          products {
            id,
            title,
            price
          }
        }
      `;

      const response = await fetch(
        'https://api-eu-central-1.graphcms.com/v2/ckl00k49r91s701z80x52eknp/master',
        {
          method: 'POST',
          body: JSON.stringify({ query, variables: {} }),
        }
      );

      if (!response.ok) throw new Error(response.statusText);

      const parsedResponse = response.json() as Promise<{
        data: { products: Product[] };
      }>;

      return (await parsedResponse).data.products.map(product => ({
        ...product,
        // CMS stores prices as a float.
        price: Math.round(product.price * 100),
      }));
    } catch (err) {
      console.error(`Failed to retrieve products: ${err.message}`);
    }
  }
}
