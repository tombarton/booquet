import { Module } from '@nestjs/common';
import { ContentfulController } from './contentful.controller';
import { ContentfulService } from './contentful.service';
import { ContentfulGuard } from './contentful.guard';
import { SharedServices } from '@common/services';

@Module({
  imports: [SharedServices],
  providers: [ContentfulService, ContentfulGuard],
  controllers: [ContentfulController],
})
export class ContentfulModule {}
