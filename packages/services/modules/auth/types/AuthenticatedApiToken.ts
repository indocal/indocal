import { UUID } from '../../../common';

export interface AuthenticatedApiToken {
  id: UUID;
  name: string;
  description: string;
}

export default AuthenticatedApiToken;
