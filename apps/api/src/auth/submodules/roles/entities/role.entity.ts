import {
  UserRole as DBUserRoleModel,
  UserRolePermission as DBUserRolePermissionModel,
  User as DBUserModel,
} from '@prisma/client';

import { Entity, UUID } from '@/common';

import { UserRolePermissionEntity } from '../../permissions';
import { UserEntity } from '../../users';

type Include = Partial<{
  permissions: DBUserRolePermissionModel[];
  users: DBUserModel[];
}>;

export type UserRoleAccessType = 'NONE' | 'STANDARD' | 'ADMIN';

export type UserRoleConfig = Partial<{
  access: Record<string, UserRoleAccessType>;
}>;

export class UserRoleEntity implements Entity, DBUserRoleModel {
  permissions?: UserRolePermissionEntity[];
  users?: UserEntity[];

  constructor(role: DBUserRoleModel, include?: Include) {
    Object.assign(this, role);

    if (include?.permissions) {
      this.permissions = include.permissions.map(
        (permission) => new UserRolePermissionEntity(permission)
      );
    }

    if (include?.users) {
      this.users = include.users.map((user) => new UserEntity(user));
    }
  }

  id: UUID;
  type: string;
  name: string;
  description: string;
  config: UserRoleConfig | null;
  createdAt: Date;
  updatedAt: Date;
}

export default UserRoleEntity;
