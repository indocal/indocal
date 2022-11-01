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

import { UUID } from '@/common';
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';

import EventsService from './events.service';
import { EventEntity } from './entities';
import {
  FindManyEventsParamsDto,
  CountEventsParamsDto,
  CreateEventDto,
  UpdateEventDto,
} from './dto';

@Controller('events')
@UseGuards(PoliciesGuard)
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'event'))
  async create(@Body() createEventDto: CreateEventDto): Promise<EventEntity> {
    const event = await this.eventsService.create(createEventDto);

    return new EventEntity(event);
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'event'))
  async count(@Query() query: CountEventsParamsDto): Promise<number> {
    return await this.eventsService.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'event'))
  async findMany(
    @Query() query: FindManyEventsParamsDto
  ): Promise<EventEntity[]> {
    const events = await this.eventsService.findMany({
      where: query.filters,
      distinct: query.distinct,
      orderBy: query.orderBy,
      skip: query.pagination?.skip && Number(query.pagination.skip),
      take: query.pagination?.take && Number(query.pagination.take),
      cursor: query.pagination?.cursor,
    });

    return events.map((event) => new EventEntity(event));
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'event'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<EventEntity | null> {
    const event = await this.eventsService.findUnique('id', id);

    return event ? new EventEntity(event) : null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'event'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<EventEntity> {
    const event = await this.eventsService.update(id, updateEventDto);

    return new EventEntity(event);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'event'))
  async delete(@Param('id', ParseUUIDPipe) id: UUID): Promise<EventEntity> {
    const event = await this.eventsService.delete(id);

    return new EventEntity(event);
  }
}

export default EventsController;
