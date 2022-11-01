import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTHENTICATION_KEY = 'skip_authentication';

export const SkipAuthentication = () =>
  SetMetadata(SKIP_AUTHENTICATION_KEY, true);

export default SkipAuthentication;
