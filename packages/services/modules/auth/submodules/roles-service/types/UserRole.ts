import { Entity } from '../../../../../common';

import { UserStatus } from '../../users-service';

type Permission = Entity & {
  action: string;
};

type User = Entity & {
  username: string;
  email: string;
  name: string;
  status: UserStatus;
};

export type UserRoleAccessType = 'FORBIDDEN' | 'ALLOWED';

export type UserRoleConfig = Partial<{
  access: {
    studio: UserRoleAccessType;
    hub: UserRoleAccessType;
    app: UserRoleAccessType;
    nobu: UserRoleAccessType;
    warehouse: UserRoleAccessType;
  };
}>;

export interface UserRole extends Entity {
  type: string;
  name: string;
  description: string;
  config: UserRoleConfig | null;
  permissions: Permission[];
  users: User[];
}

export default UserRole;
