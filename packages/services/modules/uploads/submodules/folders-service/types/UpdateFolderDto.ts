import { UUID } from '../../../../../common';

export type UpdateFolderDto = Partial<{
  name: string;
  folder: UUID | null;
}>;

export default UpdateFolderDto;
