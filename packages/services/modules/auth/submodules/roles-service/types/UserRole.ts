import { Entity, UUID } from '../../../../../common';

import { UserStatus } from '../../users-service';

type Permission = {
  id: UUID;
  action: string;
  createdAt: string;
  updatedAt: string;
};

type User = {
  id: UUID;
  username: string;
  email: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

export interface UserRole extends Entity {
  type: string;
  name: string;
  description: string;
  config?: object;
  permissions: Permission[];
  users: User[];
  createdAt: string;
  updatedAt: string;
}

export default UserRole;
