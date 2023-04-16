import { AuthenticatedUser } from '@indocal/services';

declare module 'next-auth' {
  type User = AuthenticatedUser;

  interface Session {
    user: AuthenticatedUser;
    expires: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: AuthenticatedUser;
    access_token: string;
  }
}
