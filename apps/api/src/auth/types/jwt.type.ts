import AuthenticatedApiToken from './authenticated-api-token.interface';
import AuthenticatedUser from './authenticated-user.interface';

export type ApiTokenJwt = {
  type: 'api-token';
  apiToken: AuthenticatedApiToken;
};

export type UserJwt = {
  type: 'user';
  user: AuthenticatedUser;
};

export type JWT = ApiTokenJwt | UserJwt;

export default JWT;
