import { Exclude } from 'class-transformer';
import {
  User as DBUserModel,
  UserStatus as DBUserStatusEnum,
  UserRole as DBUserRoleModel,
  UserGroup as DBUserGroupModel,
} from '@prisma/client';

import { Entity, UUID } from '@/common';

import { UserRoleEntity } from '../../roles';
import { UserGroupEntity } from '../../groups';

export class UserEntity implements Entity, DBUserModel {
  roles?: UserRoleEntity[];
  groups?: UserGroupEntity[];

  constructor(
    user: DBUserModel,
    roles?: DBUserRoleModel[],
    groups?: DBUserGroupModel[]
  ) {
    Object.assign(this, user);

    if (roles) {
      this.roles = roles.map((role) => new UserRoleEntity(role));
    }

    if (groups) {
      this.groups = groups.map((group) => new UserGroupEntity(group));
    }
  }

  id: UUID;
  username: string;
  email: string;

  @Exclude()
  password: string;

  status: DBUserStatusEnum;

  createdAt: Date;
  updatedAt: Date;
}

export default UserEntity;
