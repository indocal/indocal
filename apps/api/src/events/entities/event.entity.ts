import {
  Event as DBEventModel,
  EventStatus as DBEventStatusEnum,
  EventGuest as DBEventGuestModel,
} from '@prisma/client';

import { Entity, UUID } from '@/common';

import { EventGuestEntity } from '../submodules';

export class EventEntity implements Entity, DBEventModel {
  guests?: EventGuestEntity[];

  constructor(event: DBEventModel, guests?: DBEventGuestModel[]) {
    Object.assign(this, event);

    if (guests) {
      this.guests = guests.map((guest) => new EventGuestEntity(guest));
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
