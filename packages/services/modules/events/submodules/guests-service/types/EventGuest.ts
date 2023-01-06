import { Entity, UUID } from '../../../../../common';

import { EventStatus } from '../../../types';

type Event = {
  id: UUID;
  slug: string;
  title: string;
  description: string | null;
  status: EventStatus;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
};

export interface EventGuest extends Entity {
  dni: string;
  name: string;
  email: string;
  phone: string;
  from: string;
  position: string;
  event: Event;
  createdAt: string;
  updatedAt: string;
}

export default EventGuest;
