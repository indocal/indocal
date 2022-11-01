import { UUID } from '../../../common';

import PermissionsByModel from './PermissionsByModel';

type Role = {
  id: UUID;
  type: string;
  name: string;
  description: string;
};

export type PermissionsByRole = {
  role: Role;
  permissions: PermissionsByModel;
};

export default PermissionsByRole;
