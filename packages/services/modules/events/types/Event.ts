import { Entity, UUID } from '../../../common';

type Guest = {
  id: UUID;
  dni: string;
  name: string;
  email: string;
  phone: string;
  from: string;
  position: string;
  createdAt: string;
  updatedAt: string;
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
