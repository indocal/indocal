import { UUID } from '../../../../../common';

export type UpdateUserGroupDto = Partial<{
  name: string;
  description: string | null;
  members: UUID[];
}>;

export default UpdateUserGroupDto;
