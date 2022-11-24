import {
  Event as DBEventModel,
  EventStatus as DBEventStatusEnum,
  EventGuest as DBEventGuestModel,
} from '@prisma/client';

import { Entity, UUID } from '@/common';

import { EventGuestEntity } from '../submodules';

type Include = Partial<{
  guests: DBEventGuestModel[];
}>;

export class EventEntity implements Entity, DBEventModel {
  guests?: EventGuestEntity[];

  constructor(event: DBEventModel, include?: Include) {
    Object.assign(this, event);

    if (include?.guests) {
      this.guests = include.guests.map((guest) => new EventGuestEntity(guest));
    }
  }

  id: UUID;
  slug: string;
  title: string;
  description: string | null;
  status: DBEventStatusEnum;
  scheduledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default EventEntity;
