import { withAuth } from 'next-auth/middleware';

import { Pages } from '@/config';

export default withAuth({
  pages: {
    signIn: Pages.SIGN_IN,
    error: Pages.SIGN_IN,
  },
});

export const config = {
  matcher: '/((?!favicon.ico|static|public|auth|api).*)',
};

/*
 * Match all request paths except for the ones starting with:
 * - favicon.ico (favicon file)
 * - static (static files)
 * - public (public pages)
 * - api (API routes)
 */
