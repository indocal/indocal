import { Entity, UUID } from '../../../../../common';

import { UserStatus } from '../../users-service';

type Member = {
  id: UUID;
  username: string;
  email: string;
  name: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

export interface UserGroup extends Entity {
  name: string;
  description: string | null;
  members: Member[];
}

export default UserGroup;
