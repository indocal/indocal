import { NextApiHandler } from 'next';
import NextAuth, { User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { setCookie, destroyCookie } from 'nookies';

import { Session, User, TOKEN_KEY, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';
import { Pages } from '@/config';

const handler: NextApiHandler = async (req, res) =>
  await NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: 'Username', type: 'text' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          if (!credentials) throw new Error('Missing credentials');

          const { session, error } = await indocal.auth.signInByCredentials(
            credentials.username,
            credentials.password
          );

          if (error) throw error;

          if (session) {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}${ApiEndpoints.USERS}/${session.user.id}`,
              { headers: { Authorization: `Bearer ${session.access_token}` } }
            );

            const user: User | null = await response.json();

            const hasPermissions = user?.roles.some(
              (role) => role.config?.access?.hub === 'ALLOWED'
            );

            if (!hasPermissions) throw new Error('Acceso restringido');

            return session as unknown as NextAuthUser;
          }

          return null;
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        const session = user as unknown as Session;

        if (session) {
          token.user = session.user;
          token.access_token = session.access_token;
        }

        return token;
      },
      async session({ session, token }) {
        session.user = token.user;

        return session;
      },
    },
    events: {
      session({ token, session }) {
        setCookie({ res }, TOKEN_KEY, token.access_token, {
          path: '/',
          expires: new Date(session.expires),
        });
      },
      signOut() {
        destroyCookie({ res }, TOKEN_KEY, {
          path: '/',
        });
      },
    },
    pages: {
      signIn: Pages.SIGN_IN,
      error: Pages.SIGN_IN,
    },
  });

export default handler;
