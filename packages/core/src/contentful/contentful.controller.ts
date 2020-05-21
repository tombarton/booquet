import { Controller, Post, UseGuards } from '@nestjs/common';
import { ContentfulGuard } from './contentful.guard';
import { ContentfulService } from './contentful.service';

@Controller('contentful')
@UseGuards(ContentfulGuard)
export class ContentfulController {
  constructor(private readonly contentfulService: ContentfulService) {}

  @Post('/update-products')
  updateProducts(): string {
    // Don't wait for the promise to resolve before responding
    // otherwise the webhook could potentially time out if
    // we're dealing with a large number of updates.
    this.contentfulService.updateProducts();

    return 'OK';
  }
}
