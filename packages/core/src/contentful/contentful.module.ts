import { Module } from '@nestjs/common';
import { SharedServices } from '@common/services';
import { ContentfulController } from './contentful.controller';
import { ContentfulService } from './contentful.service';
import { ContentfulGuard } from './contentful.guard';

@Module({
  imports: [SharedServices],
  providers: [ContentfulService, ContentfulGuard],
  controllers: [ContentfulController],
})
export class ContentfulModule {}
