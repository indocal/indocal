import { EventGuest as DBEventGuestModel } from '@prisma/client';
import { Exclude } from 'class-transformer';

import { Entity, UUID } from '@/common';

export class EventGuestEntity implements Entity, DBEventGuestModel {
  constructor(guest: DBEventGuestModel) {
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
  eventId: string;

  createdAt: Date;
  updatedAt: Date;
}

export default EventGuestEntity;
