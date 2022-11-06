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

type Group = {
  id: UUID;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type UserStatus = 'ENABLED' | 'DISABLED';

export interface User extends Entity {
  username: string;
  email: string;
  status: UserStatus;
  roles: Role[];
  groups: Group[];
  createdAt: string;
  updatedAt: string;
}

export default User;
