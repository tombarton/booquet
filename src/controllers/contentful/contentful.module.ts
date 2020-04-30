import { Module } from '@nestjs/common';
import { ContentfulController } from './contentful.controller';
import { ContentfulService } from '../../services/contentful.service';
import { PrismaService } from '../../services/prisma.service';
import { ContentfulGuard } from '../../guards/contentful.guard';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ContentfulService, PrismaService, ContentfulGuard, ConfigService],
  controllers: [ContentfulController],
  exports: [ContentfulGuard],
})
export class ContentfulModule {}
