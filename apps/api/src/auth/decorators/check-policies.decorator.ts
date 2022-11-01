import { SetMetadata } from '@nestjs/common';

import { Policy } from '../strategies';

export const CHECK_POLICIES_KEY = 'check_policies';

export const CheckPolicies = (...policies: Policy[]) =>
  SetMetadata(CHECK_POLICIES_KEY, policies);

export default CheckPolicies;
