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

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';
import { EventEntity } from '@/events';
import { PrismaService } from '@/prisma';

import { EventGuestEntity } from './entities';
import { CreateEventGuestDto, UpdateEventGuestDto } from './dto';

class EnhancedEventGuest extends EventGuestEntity {
  event: EventEntity;
}

@Controller()
@UseGuards(PoliciesGuard)
export class EventsGuestsController {
  constructor(private prismaService: PrismaService) {}

  @Post('events/:event_id/guests')
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'eventGuest'))
  async create(
    @Param('event_id') eventId: UUID,
    @Body() createGuestDto: CreateEventGuestDto
  ): Promise<SingleEntityResponse<EnhancedEventGuest>> {
    const { event, ...rest } = await this.prismaService.eventGuest.create({
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

    const guest = new EnhancedEventGuest(rest);
    guest.event = new EventEntity(event);

    return guest;
  }

  @Get('events/:event_id/guests/count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'eventGuest'))
  async count(@Param('event_id') eventId: UUID): Promise<number> {
    return await this.prismaService.eventGuest.count({
      where: { event: { id: eventId } },
    });
  }

  @Get('events/:event_id/guests')
  @CheckPolicies((ability) => ability.can(Action.READ, 'eventGuest'))
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
      entities: guests.map(({ event, ...rest }) => {
        const guest = new EnhancedEventGuest(rest);
        guest.event = new EventEntity(event);

        return guest;
      }),
    };
  }

  @Get('events/guests/:id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'eventGuest'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedEventGuest | null>> {
    const response = await this.prismaService.eventGuest.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!response) return null;

    const { event, ...rest } = response;

    const guest = new EnhancedEventGuest(rest);
    guest.event = new EventEntity(event);

    return guest;
  }

  @Patch('events/guests/:id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'eventGuest'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateGuestDto: UpdateEventGuestDto
  ): Promise<SingleEntityResponse<EnhancedEventGuest>> {
    const { event, ...rest } = await this.prismaService.eventGuest.update({
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

    const guest = new EnhancedEventGuest(rest);
    guest.event = new EventEntity(event);

    return guest;
  }

  @Delete('events/guests/:id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'eventGuest'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedEventGuest>> {
    const { event, ...rest } = await this.prismaService.eventGuest.delete({
      where: { id },
      include: { event: true },
    });

    const guest = new EnhancedEventGuest(rest);
    guest.event = new EventEntity(event);

    return guest;
  }
}

export default EventsGuestsController;
