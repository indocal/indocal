import { Exclude } from 'class-transformer';
import { User, UserStatus } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class UserEntity implements Entity, User {
  constructor(user: User) {
    Object.assign(this, user);
  }

  id: UUID;
  username: string;
  email: string;
  name: string;

  @Exclude()
  password: string;

  status: UserStatus;

  createdAt: Date;
  updatedAt: Date;
}

export default UserEntity;
