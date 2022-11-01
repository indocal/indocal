export type UpdateFormDto = Partial<{
  slug: string;
  title: string;
  description: string | null;
}>;

export default UpdateFormDto;
