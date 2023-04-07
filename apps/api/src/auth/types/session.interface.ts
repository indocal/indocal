import AuthenticatedUser from './authenticated-user.interface';

export interface Session {
  user: AuthenticatedUser;
  access_token: string; // UserJwt
  issued_at: string;
}

export default Session;
