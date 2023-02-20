import { UUID } from '../../../../../common';

export type UpdateFileDto = Partial<{
  name: string;
  caption: string | null;
  alt: string | null;
  folder: UUID | null;
}>;

export default UpdateFileDto;
