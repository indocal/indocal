import { Entity } from '../../../../../common';

export interface EventGuest extends Entity {
  dni: string;
  name: string;
  email: string;
  phone: string;
  from: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}

export default EventGuest;
