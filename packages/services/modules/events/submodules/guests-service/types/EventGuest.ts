import { Entity } from '../../../../../common';

import { EventStatus } from '../../../types';

type Event = Entity & {
  slug: string;
  title: string;
  description: string | null;
  status: EventStatus;
  scheduledAt: string;
};

export interface EventGuest extends Entity {
  dni: string;
  name: string;
  email: string;
  phone: string;
  from: string;
  position: string;
  event: Event;
}

export default EventGuest;
