import { UUID } from '../../../common';

export type CreateFormDto = {
  slug: string;
  title: string;
  description?: string;
  group: UUID;
};

export default CreateFormDto;
