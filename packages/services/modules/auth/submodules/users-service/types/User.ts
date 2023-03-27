import { Entity } from '../../../../../common';

import { UserRoleConfig } from '../../roles-service';

type Role = Entity & {
  type: string;
  name: string;
  description: string;
  config: UserRoleConfig | null;
};

type Group = Entity & {
  name: string;
  description: string | null;
};

export type UserStatus = 'ENABLED' | 'DISABLED';

export interface User extends Entity {
  username: string;
  email: string;
  name: string;
  status: UserStatus;
  roles: Role[];
  groups: Group[];
}

export default User;
