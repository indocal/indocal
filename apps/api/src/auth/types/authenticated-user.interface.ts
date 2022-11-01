import { Entity } from '@/common';

export interface AuthenticatedUser extends Entity {
  username: string;
  email: string;
}

export default AuthenticatedUser;
