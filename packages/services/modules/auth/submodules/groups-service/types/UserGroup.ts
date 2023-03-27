import { Entity } from '../../../../../common';

import { UserStatus } from '../../users-service';

type Member = Entity & {
  username: string;
  email: string;
  name: string;
  status: UserStatus;
};

export interface UserGroup extends Entity {
  name: string;
  description: string | null;
  members: Member[];
}

export default UserGroup;
