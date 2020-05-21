import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createClient as createDeliveryClient,
  ContentfulClientApi as DeliveryClientAPI,
  Entry,
} from 'contentful';
import {
  createClient as createManagementClient,
  ClientAPI as ManagementClientAPI,
} from 'contentful-management';

import { PrismaService } from '@common/services/prisma.service';
import { asyncForEach } from '@common/utils/asyncForEach';
import { ContentfulProduct, ContentfulEvent } from '@root/types';

export enum Cookies {
  SIGNATURE = 'SIGNATURE',
  PARTIAL_JWT = 'PARTIAL_JWT',
}

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
    const productContent: Entry<ContentfulProduct | ContentfulEvent>[] = [];
    const segmentSize = 1000;
    let fetchedAllContent = false;
    let paginationSkip = 0;

    // Fetch all the product data from contentful. There is the chance that this could be paginated if they have
    // over 1000 pieces of content so we've included some simple pagination functionaltiy to loop over this.
    while (!fetchedAllContent) {
      const productDataSegment = await this.contentfulClient.getEntries<
        ContentfulProduct | ContentfulEvent
      >({
        limit: segmentSize,
        skip: paginationSkip,
      });

      const { items, total, skip } = productDataSegment;

      productContent.push(...items);

      // Check the total is higher than segment size plus the length of the items array.
      if (items.length + skip < total) {
        paginationSkip = skip + segmentSize;
      } else {
        fetchedAllContent = true;
      }
    }

    // We're waiting for Prisma 2 to release the .batch() method for this as this
    // is really bad from a performance point-of-view. Each individual loop is a
    // DB transaction. If there's potentially 1000 items, that's a stupid amount
    // of pressure to put on the databse just to simply update the products.
    await asyncForEach<Entry<ContentfulProduct | ContentfulEvent>>(
      productContent,
      async content => {
        switch (content.sys.contentType.sys.id) {
          case 'product': {
            const product = content as Entry<ContentfulProduct>;
            return await this.prismaService.product.upsert({
              create: {
                id: product.sys.id,
                name: product.fields.title,
                price: product.fields.price,
              },
              update: {
                name: product.fields.title,
                price: product.fields.price,
              },
              where: {
                id: product.sys.id,
              },
            });
          }
          case 'event': {
            const event = content as Entry<ContentfulEvent>;
            return await this.prismaService.event.upsert({
              create: {
                id: event.sys.id,
                title: event.fields.title,
                date: new Date(event.fields.date),
                capacity: event.fields.availableSpaces,
              },
              update: {
                title: event.fields.title,
                date: new Date(event.fields.date),
                capacity: event.fields.availableSpaces,
              },
              where: {
                id: event.sys.id,
              },
            });
          }
          default: {
            console.error(
              `No case found for content type: ${content.sys.contentType.sys.id}`
            );
          }
        }
      }
    );
  }
}
