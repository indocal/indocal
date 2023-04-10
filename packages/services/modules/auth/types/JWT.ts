import AuthenticatedApiToken from './AuthenticatedApiToken';
import AuthenticatedUser from './AuthenticatedUser';

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
