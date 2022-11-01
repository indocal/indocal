import { UUID } from '../../../../../common';

import { UserStatus } from './User';

export type UpdateUserDto = Partial<{
  username: string;
  email: string;
  status: UserStatus;
  roles: UUID[];
  groups: UUID[];
}>;

export default UpdateUserDto;
