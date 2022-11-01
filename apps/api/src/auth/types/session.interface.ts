import AuthenticatedUser from './authenticated-user.interface';

export interface Session {
  user: AuthenticatedUser;
  access_token: string;
  issued_at: string;
}

export default Session;
