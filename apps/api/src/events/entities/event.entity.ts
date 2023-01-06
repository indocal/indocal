import { Event, EventStatus } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class EventEntity implements Entity, Event {
  constructor(event: Event) {
    Object.assign(this, event);
  }

  id: UUID;
  slug: string;
  title: string;
  description: string | null;
  status: EventStatus;
  scheduledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default EventEntity;
