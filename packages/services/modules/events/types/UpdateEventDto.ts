export type UpdateEventDto = Partial<{
  slug: string;
  title: string;
  description: string | null;
  scheduledAt: string;
}>;

export default UpdateEventDto;
