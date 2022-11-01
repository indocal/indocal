import { Page } from '@indocal/ui';

import { SignIn } from '@/auth';
import { EnhancedNextPage } from '@/types';

const SignInPage: EnhancedNextPage = () => (
  <Page title="Iniciar sesión">
    <SignIn />
  </Page>
);

export default SignInPage;
