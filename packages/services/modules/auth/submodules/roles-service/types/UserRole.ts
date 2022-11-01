import { Entity, UUID } from '../../../../../common';

type Permission = {
  id: UUID;
  action: string;
  createdAt: string;
  updatedAt: string;
};

export interface UserRole extends Entity {
  type: string;
  name: string;
  description: string;
  config?: object;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export default UserRole;
