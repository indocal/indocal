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

type Include = Partial<{
  roles: DBUserRoleModel[];
  groups: DBUserGroupModel[];
}>;

export class UserEntity implements Entity, DBUserModel {
  roles?: UserRoleEntity[];
  groups?: UserGroupEntity[];

  constructor(user: DBUserModel, include?: Include) {
    Object.assign(this, user);

    if (include?.roles) {
      this.roles = include.roles.map((role) => new UserRoleEntity(role));
    }

    if (include?.groups) {
      this.groups = include.groups.map((group) => new UserGroupEntity(group));
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
