import {
  UserGroup as DBUserGroupModel,
  User as DBUserModel,
} from '@prisma/client';

import { Entity, UUID } from '@/common';

import { UserEntity } from '../../users';

type Include = Partial<{
  members: DBUserModel[];
}>;

export class UserGroupEntity implements Entity, DBUserGroupModel {
  members?: UserEntity[];

  constructor(group: DBUserGroupModel, include?: Include) {
    Object.assign(this, group);

    if (include?.members) {
      this.members = include.members.map((member) => new UserEntity(member));
    }
  }

  id: UUID;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default UserGroupEntity;
