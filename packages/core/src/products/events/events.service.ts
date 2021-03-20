import { Injectable } from '@nestjs/common';
import { EventParticipant } from '@prisma/client';

import { PrismaService } from '@common/services';
import { Event } from './dto/event';

type ParticipantDetails = Omit<EventParticipant, 'id' | 'eventId'>;

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRemainingPlaces(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { participants: true },
    });

    return {
      id: event.id,
      title: event.title,
      totalCapacity: event.capacity,
      remainingCapacity: event.capacity - event.participants.length,
    };
  }

  async registerParticpant(eventId: string, participant: ParticipantDetails) {
    const registeredParticipant = await this.prisma.eventParticipant.create({
      data: {
        Event: {
          connect: { id: eventId },
        },
        ...participant,
      },
    });

    return registeredParticipant;
  }

  async updateParticipant(participant: EventParticipant) {
    const updatedParticipant = await this.prisma.eventParticipant.update({
      where: { id: participant.id },
      data: participant,
    });

    return updatedParticipant;
  }

  async deleteParticipant(participantId: string) {
    return await this.prisma.eventParticipant.delete({
      where: { id: participantId },
    });
  }
}
