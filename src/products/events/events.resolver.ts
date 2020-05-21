import { Query, Resolver, Args } from '@nestjs/graphql';

import { Event } from './dto/event';
import { EventCapacityInput } from './dto/event-capacity.input';
import { EventsService } from './events.service';

@Resolver('Events')
export class EventsResolver {
  constructor(private readonly events: EventsService) {}

  @Query(returns => Event)
  async getEventCapacity(
    @Args('data') eventCapacity: EventCapacityInput
  ): Promise<Event> {
    return await this.events.getRemainingPlaces(eventCapacity.id);
  }
}
