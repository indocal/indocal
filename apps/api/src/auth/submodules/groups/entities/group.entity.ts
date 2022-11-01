import {
  UserGroup as DBUserGroupModel,
  User as DBUserModel,
} from '@prisma/client';

import { Entity, UUID } from '@/common';

import { UserEntity } from '../../users';

export class UserGroupEntity implements Entity, DBUserGroupModel {
  members?: UserEntity[];

  constructor(group: DBUserGroupModel, members?: DBUserModel[]) {
    Object.assign(this, group);

    if (members) {
      this.members = members.map((member) => new UserEntity(member));
    }
  }

  id: UUID;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default UserGroupEntity;
