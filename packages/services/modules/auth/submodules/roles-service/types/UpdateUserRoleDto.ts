import { UUID } from '../../../../../common';

import { UserRoleConfig } from './UserRole';

export type UpdateUserRoleDto = Partial<{
  type: string;
  name: string;
  description: string;
  config: UserRoleConfig;
  users: UUID[];
}>;

export default UpdateUserRoleDto;
