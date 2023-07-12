import { UserRole } from '@prisma/client';

import { Entity, UUID } from '@/common';

export type UserRoleAccessType = 'NONE' | 'STANDARD' | 'ADMIN';

export type UserRoleConfig = Partial<{
  access: {
    studio: UserRoleAccessType;
    hub: UserRoleAccessType;
    app: UserRoleAccessType;
    nobu: UserRoleAccessType;
    warehouse: UserRoleAccessType;
  };
}>;

export class UserRoleEntity implements Entity, UserRole {
  constructor(role: UserRole) {
    Object.assign(this, role);
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
