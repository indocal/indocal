import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { EventGuest, Event } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { EventEntity } from '../../entities';

import { EventGuestEntity } from './entities';
import { CreateEventGuestDto, UpdateEventGuestDto } from './dto';

class EnhancedEventGuest extends EventGuestEntity {
  event: EventEntity;
}

type CreateEnhancedEventGuest = EventGuest & {
  event: Event;
};

@Controller()
@UseGuards(PoliciesGuard)
export class EventsGuestsController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedEventGuest({
    event,
    ...rest
  }: CreateEnhancedEventGuest): EnhancedEventGuest {
    const guest = new EnhancedEventGuest(rest);
    guest.event = new EventEntity(event);

    return guest;
  }

  @Post('events/:event_id/guests')
  @CheckPolicies((ability) => ability.can('create', 'eventGuest'))
  async create(
    @Param('event_id') eventId: UUID,
    @Body() createGuestDto: CreateEventGuestDto
  ): Promise<SingleEntityResponse<EnhancedEventGuest>> {
    const guest = await this.prismaService.eventGuest.create({
      data: {
        dni: createGuestDto.dni,
        name: createGuestDto.name,
        email: createGuestDto.email,
        phone: createGuestDto.phone,
        from: createGuestDto.from,
        position: createGuestDto.position,
        event: {
          connect: { id: eventId },
        },
      },
      include: { event: true },
    });

    return this.createEnhancedEventGuest(guest);
  }

  @Get('events/:event_id/guests/count')
  @CheckPolicies((ability) => ability.can('count', 'eventGuest'))
  async count(@Param('event_id') eventId: UUID): Promise<number> {
    return await this.prismaService.eventGuest.count({
      where: { event: { id: eventId } },
    });
  }

  @Get('events/:event_id/guests')
  @CheckPolicies((ability) => ability.can('read', 'eventGuest'))
  async findAll(
    @Param('event_id') eventId: UUID
  ): Promise<MultipleEntitiesResponse<EnhancedEventGuest>> {
    const [guests, count] = await this.prismaService.$transaction([
      this.prismaService.eventGuest.findMany({
        where: { event: { id: eventId } },
        include: { event: true },
      }),
      this.prismaService.eventGuest.count({
        where: { event: { id: eventId } },
      }),
    ]);

    return {
      count,
      entities: guests.map((guest) => this.createEnhancedEventGuest(guest)),
    };
  }

  @Get('events/guests/:id')
  @CheckPolicies((ability) => ability.can('read', 'eventGuest'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedEventGuest | null>> {
    const guest = await this.prismaService.eventGuest.findUnique({
      where: { id },
      include: { event: true },
    });

    return guest ? this.createEnhancedEventGuest(guest) : null;
  }

  @Patch('events/guests/:id')
  @CheckPolicies((ability) => ability.can('update', 'eventGuest'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateGuestDto: UpdateEventGuestDto
  ): Promise<SingleEntityResponse<EnhancedEventGuest>> {
    const guest = await this.prismaService.eventGuest.update({
      where: { id },
      data: {
        dni: updateGuestDto.dni,
        name: updateGuestDto.name,
        email: updateGuestDto.email,
        phone: updateGuestDto.phone,
        from: updateGuestDto.from,
        position: updateGuestDto.position,
      },
      include: { event: true },
    });

    return this.createEnhancedEventGuest(guest);
  }

  @Delete('events/guests/:id')
  @CheckPolicies((ability) => ability.can('delete', 'eventGuest'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedEventGuest>> {
    const guest = await this.prismaService.eventGuest.delete({
      where: { id },
      include: { event: true },
    });

    return this.createEnhancedEventGuest(guest);
  }
}

export default EventsGuestsController;
