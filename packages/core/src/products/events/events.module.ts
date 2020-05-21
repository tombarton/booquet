import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { SharedServices } from '@common/services';

@Module({
  imports: [SharedServices],
  providers: [EventsService, EventsResolver],
})
export class EventsModule {}
