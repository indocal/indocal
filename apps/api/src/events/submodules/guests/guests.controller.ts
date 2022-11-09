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

import { UUID } from '@/common';
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';

import EventsGuestsService from './guests.service';
import { EventGuestEntity } from './entities';
import { CreateEventGuestDto, UpdateEventGuestDto } from './dto';

@Controller()
@UseGuards(PoliciesGuard)
export class EventsGuestsController {
  constructor(private eventsGuestsService: EventsGuestsService) {}

  @Post('events/:event_id/guests')
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'eventGuest'))
  async create(
    @Param('event_id') eventId: UUID,
    @Body() createGuestDto: CreateEventGuestDto
  ): Promise<EventGuestEntity> {
    const guest = await this.eventsGuestsService.create(
      eventId,
      createGuestDto
    );

    return new EventGuestEntity(guest);
  }

  @Get('events/:event_id/guests/count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'eventGuest'))
  async count(@Param('event_id') eventId: UUID): Promise<number> {
    return await this.eventsGuestsService.count(eventId);
  }

  @Get('events/:event_id/guests')
  @CheckPolicies((ability) => ability.can(Action.READ, 'eventGuest'))
  async findAll(@Param('event_id') eventId: UUID): Promise<EventGuestEntity[]> {
    const guests = await this.eventsGuestsService.findAll(eventId);

    return guests.map((guest) => new EventGuestEntity(guest));
  }

  @Get('events/guests/:id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'eventGuest'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<EventGuestEntity | null> {
    const guest = await this.eventsGuestsService.findUnique('id', id);

    return guest ? new EventGuestEntity(guest) : null;
  }

  @Patch('events/guests/:id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'eventGuest'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateGuestDto: UpdateEventGuestDto
  ): Promise<EventGuestEntity> {
    const guest = await this.eventsGuestsService.update(id, updateGuestDto);

    return new EventGuestEntity(guest);
  }

  @Delete('events/guests/:id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'eventGuest'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<EventGuestEntity> {
    const guest = await this.eventsGuestsService.delete(id);

    return new EventGuestEntity(guest);
  }
}

export default EventsGuestsController;
