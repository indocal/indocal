import { UUID } from '../../../common';

import { FormStatus, FormVisibility } from './Form';

export type UpdateFormDto = Partial<{
  slug: string;
  title: string;
  description: string | null;
  status: FormStatus;
  visibility: FormVisibility;
  group: UUID;
}>;

export default UpdateFormDto;
