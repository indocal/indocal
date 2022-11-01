import { withAuth } from 'next-auth/middleware';

import { Pages } from '@/config';

export default withAuth({
  pages: {
    signIn: Pages.SIGN_IN,
    error: Pages.SIGN_IN,
  },
});

export const config = { matcher: '/admin/:path*' };
