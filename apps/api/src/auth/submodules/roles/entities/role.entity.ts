import {
  Prisma,
  UserRole as DBUserRoleModel,
  UserRolePermission as DBUserRolePermissionModel,
} from '@prisma/client';

import { Entity, UUID } from '@/common';

import { UserRolePermissionEntity } from '../../permissions';

export class UserRoleEntity implements Entity, DBUserRoleModel {
  permissions?: UserRolePermissionEntity[];

  constructor(
    role: DBUserRoleModel,
    permissions?: DBUserRolePermissionModel[]
  ) {
    Object.assign(this, role);

    if (permissions) {
      this.permissions = permissions.map(
        (permission) => new UserRolePermissionEntity(permission)
      );
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
