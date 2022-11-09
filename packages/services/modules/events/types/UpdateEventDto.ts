import { EventStatus } from './Event';

export type UpdateEventDto = Partial<{
  slug: string;
  title: string;
  description: string | null;
  status: EventStatus;
  scheduledAt: string;
}>;

export default UpdateEventDto;
