import { Exclude } from 'class-transformer';
import { UserRolePermission } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class UserRolePermissionEntity implements Entity, UserRolePermission {
  constructor(permission: UserRolePermission) {
    Object.assign(this, permission);
  }

  id: UUID;
  action: string;

  @Exclude()
  roleId: UUID;

  createdAt: Date;
  updatedAt: Date;
}

export default UserRolePermissionEntity;
