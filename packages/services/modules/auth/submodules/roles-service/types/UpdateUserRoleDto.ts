import { UUID } from '../../../../../common';

export type UpdateUserRoleDto = Partial<{
  type: string;
  name: string;
  description: string;
  users: UUID[];
}>;

export default UpdateUserRoleDto;
