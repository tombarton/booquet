import { Controller, Post, UseGuards } from '@nestjs/common';
import { ContentfulGuard } from './contentful.guard';
import { ContentfulService } from './contentful.service';

@Controller('contentful')
@UseGuards(ContentfulGuard)
export class ContentfulController {
  constructor(private readonly contentfulService: ContentfulService) {}

  @Post('/update-products')
  updateProducts(): string {
    console.log('RECEIVED WEBHOOK?');
    // Don't wait for the promise to resolve before responding
    // otherwise the webhook could potentially time out if
    // we're dealing with a large number of updates.
    try {
      this.contentfulService.updateProducts();
    } catch (err) {
      console.error(err);
    }

    return 'OK';
  }
}
