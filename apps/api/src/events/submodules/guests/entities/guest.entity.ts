import { Exclude } from 'class-transformer';
import { EventGuest } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class EventGuestEntity implements Entity, EventGuest {
  constructor(guest: EventGuest) {
    Object.assign(this, guest);
  }

  id: UUID;
  dni: string;
  name: string;
  email: string;
  phone: string;
  from: string;
  position: string;

  @Exclude()
  eventId: UUID;

  createdAt: Date;
  updatedAt: Date;
}

export default EventGuestEntity;
