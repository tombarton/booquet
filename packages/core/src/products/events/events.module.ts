import { Module } from '@nestjs/common';
import { SharedServices } from '@common/services';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';

@Module({
  imports: [SharedServices],
  providers: [EventsService, EventsResolver],
})
export class EventsModule {}
