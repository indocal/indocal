import { Entity } from '../../../../../common';

import { UserRoleConfig } from '../../roles-service';

type Role = Entity & {
  type: string;
  name: string;
  description: string;
  config: UserRoleConfig | null;
};

export interface UserRolePermission extends Entity {
  action: string;
  role: Role;
}

export default UserRolePermission;
