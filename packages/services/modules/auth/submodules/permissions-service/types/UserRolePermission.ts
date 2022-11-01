import { Entity } from '../../../../../common';

export interface UserRolePermission extends Entity {
  action: string;
  createdAt: string;
  updatedAt: string;
}

export default UserRolePermission;
