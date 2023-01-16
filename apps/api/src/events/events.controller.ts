import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';
import { EventGuestEntity } from '@/events';
import { PrismaService } from '@/prisma';

import { EventEntity } from './entities';
import {
  FindManyEventsParamsDto,
  CountEventsParamsDto,
  CreateEventDto,
  UpdateEventDto,
} from './dto';

class EnhancedEvent extends EventEntity {
  guests: EventGuestEntity[];
}

@Controller('events')
@UseGuards(PoliciesGuard)
export class EventsController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'event'))
  async create(
    @Body() createEventDto: CreateEventDto
  ): Promise<SingleEntityResponse<EnhancedEvent>> {
    const { guests, ...rest } = await this.prismaService.event.create({
      data: {
        slug: createEventDto.slug,
        title: createEventDto.title,
        description: createEventDto.description,
        scheduledAt: createEventDto.scheduledAt,
      },
      include: { guests: true },
    });

    const event = new EnhancedEvent(rest);
    event.guests = guests.map((guest) => new EventGuestEntity(guest));

    return event;
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'event'))
  async count(@Query() query: CountEventsParamsDto): Promise<number> {
    return await this.prismaService.event.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'event'))
  async findMany(
    @Query() query: FindManyEventsParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedEvent>> {
    const [events, count] = await this.prismaService.$transaction([
      this.prismaService.event.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: { guests: true },
      }),
      this.prismaService.event.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: events.map(({ guests, ...rest }) => {
        const event = new EnhancedEvent(rest);
        event.guests = guests.map((guest) => new EventGuestEntity(guest));

        return event;
      }),
    };
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'event'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedEvent | null>> {
    const response = await this.prismaService.event.findUnique({
      where: { id },
      include: { guests: true },
    });

    if (!response) return null;

    const { guests, ...rest } = response;

    const event = new EnhancedEvent(rest);
    event.guests = guests.map((guest) => new EventGuestEntity(guest));

    return event;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'event'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<SingleEntityResponse<EnhancedEvent>> {
    const { guests, ...rest } = await this.prismaService.event.update({
      where: { id },
      data: {
        slug: updateEventDto.slug,
        title: updateEventDto.title,
        description: updateEventDto.description,
        status: updateEventDto.status,
        scheduledAt: updateEventDto.scheduledAt,
      },
      include: { guests: true },
    });

    const event = new EnhancedEvent(rest);
    event.guests = guests.map((guest) => new EventGuestEntity(guest));

    return event;
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'event'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedEvent>> {
    const { guests, ...rest } = await this.prismaService.event.delete({
      where: { id },
      include: { guests: true },
    });

    const event = new EnhancedEvent(rest);
    event.guests = guests.map((guest) => new EventGuestEntity(guest));

    return event;
  }
}

export default EventsController;
