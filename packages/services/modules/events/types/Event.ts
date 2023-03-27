import { Entity } from '../../../common';

type Guest = Entity & {
  dni: string;
  name: string;
  email: string;
  phone: string;
  from: string;
  position: string;
};

export type EventStatus = 'SCHEDULED' | 'OVERDUED';

export interface Event extends Entity {
  slug: string;
  title: string;
  description: string | null;
  status: EventStatus;
  guests: Guest[];
  scheduledAt: string;
}

export default Event;
