export type CreateEventDto = {
  slug: string;
  title: string;
  description?: string;
  scheduledAt: string;
};

export default CreateEventDto;
