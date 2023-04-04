import { UUID } from '../../../../../common';

import { UserRoleConfig } from './UserRole';

export type UserRolePermissions = Record<string, Record<string, boolean>>;

export type UpdateUserRoleDto = Partial<{
  type: string;
  name: string;
  description: string;
  users: UUID[];
  config: UserRoleConfig;
  permissions: UserRolePermissions;
}>;

export default UpdateUserRoleDto;
