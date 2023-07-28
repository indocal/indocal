import { UUID } from '../../../../../common';

import { ServiceRequestStatus } from './ServiceRequest';

export type UpdateServiceRequestDto = Partial<{
  status: ServiceRequestStatus;
  currentStep: UUID;
}>;

export default UpdateServiceRequestDto;
