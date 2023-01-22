import { Entity, UUID } from '../../../../../common';

import { UserRoleConfig } from '../../roles-service';

type Role = {
  id: UUID;
  type: string;
  name: string;
  description: string;
  config: UserRoleConfig | null;
  createdAt: string;
  updatedAt: string;
};

export interface UserRolePermission extends Entity {
  action: string;
  role: Role;
}

export default UserRolePermission;
