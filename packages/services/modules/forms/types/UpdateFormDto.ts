import { UUID } from '../../../common';

import { FormStatus, FormVisibility, FormConfig } from './Form';

export type UpdateFormDto = Partial<{
  slug: string;
  title: string;
  description: string | null;
  status: FormStatus;
  visibility: FormVisibility;
  config: FormConfig;
  group: UUID;
}>;

export default UpdateFormDto;
