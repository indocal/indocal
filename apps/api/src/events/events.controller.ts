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
import { Event, EventGuest } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';
import { PrismaService } from '@/prisma';

import { EventGuestEntity } from './submodules/guests/entities';

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

type CreateEnhancedEvent = Event & {
  guests: EventGuest[];
};

@Controller('events')
@UseGuards(PoliciesGuard)
export class EventsController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedEvent({ guests, ...rest }: CreateEnhancedEvent): EnhancedEvent {
    const event = new EnhancedEvent(rest);
    event.guests = guests.map((guest) => new EventGuestEntity(guest));

    return event;
  }

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'event'))
  async create(
    @Body() createEventDto: CreateEventDto
  ): Promise<SingleEntityResponse<EnhancedEvent>> {
    const event = await this.prismaService.event.create({
      data: {
        slug: createEventDto.slug,
        title: createEventDto.title,
        description: createEventDto.description,
        scheduledAt: createEventDto.scheduledAt,
      },
      include: { guests: true },
    });

    return this.createEnhancedEvent(event);
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
      entities: events.map((event) => this.createEnhancedEvent(event)),
    };
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'event'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedEvent | null>> {
    const event = await this.prismaService.event.findUnique({
      where: { id },
      include: { guests: true },
    });

    return event ? this.createEnhancedEvent(event) : null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'event'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<SingleEntityResponse<EnhancedEvent>> {
    const event = await this.prismaService.event.update({
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

    return this.createEnhancedEvent(event);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'event'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedEvent>> {
    const event = await this.prismaService.event.delete({
      where: { id },
      include: { guests: true },
    });

    return this.createEnhancedEvent(event);
  }
}

export default EventsController;
