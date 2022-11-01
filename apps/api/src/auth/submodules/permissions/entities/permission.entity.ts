import { Exclude } from 'class-transformer';
import { UserRolePermission as DBUserRolePermissionModel } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class UserRolePermissionEntity
  implements Entity, DBUserRolePermissionModel
{
  constructor(permission: DBUserRolePermissionModel) {
    Object.assign(this, permission);
  }

  id: UUID;
  action: string;

  @Exclude()
  roleId: string;

  createdAt: Date;
  updatedAt: Date;
}

export default UserRolePermissionEntity;
