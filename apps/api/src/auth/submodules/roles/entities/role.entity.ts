import {
  Prisma,
  UserRole as DBUserRoleModel,
  UserRolePermission as DBUserRolePermissionModel,
  User as DBUserModel,
} from '@prisma/client';

import { Entity, UUID } from '@/common';

import { UserRolePermissionEntity } from '../../permissions';
import { UserEntity } from '../../users';

export class UserRoleEntity implements Entity, DBUserRoleModel {
  permissions?: UserRolePermissionEntity[];
  users?: UserEntity[];

  constructor(
    role: DBUserRoleModel,
    permissions?: DBUserRolePermissionModel[],
    users?: DBUserModel[]
  ) {
    Object.assign(this, role);

    if (permissions) {
      this.permissions = permissions.map(
        (permission) => new UserRolePermissionEntity(permission)
      );
    }

    if (users) {
      this.users = users.map((user) => new UserEntity(user));
    }
  }

  id: UUID;
  type: string;
  name: string;
  description: string;
  config: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
}

export default UserRoleEntity;
