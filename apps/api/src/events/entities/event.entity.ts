import { Prisma, Event as DBEventModel } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class EventEntity implements Entity, DBEventModel {
  constructor(event: DBEventModel) {
    Object.assign(this, event);
  }

  id: UUID;
  slug: string;
  title: string;
  description: string | null;
  guests: Prisma.JsonValue[];
  scheduledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default EventEntity;
