import { UserGroup } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class UserGroupEntity implements Entity, UserGroup {
  constructor(group: UserGroup) {
    Object.assign(this, group);
  }

  id: UUID;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default UserGroupEntity;
