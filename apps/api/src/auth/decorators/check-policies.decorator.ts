import { SetMetadata } from '@nestjs/common';

import { Policies } from '../strategies';

export const CHECK_POLICIES_KEY = 'check_policies';

export const CheckPolicies = (policies: Policies) =>
  SetMetadata(CHECK_POLICIES_KEY, policies);

export default CheckPolicies;
