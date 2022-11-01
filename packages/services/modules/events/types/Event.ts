import { Entity } from '../../../common';

export interface Event extends Entity {
  slug: string;
  title: string;
  description: string | null;
  guests: object[];
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
}

export default Event;
