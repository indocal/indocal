import { UUID } from '../../../common';

import { ServiceRequestStatus } from '../submodules';

import { ServiceStatus } from './Service';

export type UpdateServiceDto = Partial<{
  title: string;
  description: string;
  status: ServiceStatus;
  supportedRequestStatus: ServiceRequestStatus[];
  form: UUID;
}>;

export default UpdateServiceDto;
