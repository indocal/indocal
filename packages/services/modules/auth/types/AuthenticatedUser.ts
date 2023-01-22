import { UUID } from '../../../common';

export interface AuthenticatedUser {
  id: UUID;
  username: string;
  email: string;
}

export default AuthenticatedUser;
