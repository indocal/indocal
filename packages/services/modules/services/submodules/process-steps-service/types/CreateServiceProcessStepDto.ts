import { UUID } from '../../../../../common';

import { ServiceRequestStatus } from '../../requests-service';

export type CreateServiceProcessStepDto = {
  title: string;
  description?: string;
  nextRequestStatus: ServiceRequestStatus;
  owners: UUID[];
  prevStepOnReject?: UUID;
  prevStepOnApprove?: UUID;
  nextStepOnReject?: UUID;
  nextStepOnApprove?: UUID;
};

export default CreateServiceProcessStepDto;
