import { UUID } from '../../../../../common';

import { ServiceRequestStatus } from '../../requests-service';

import { ServiceProcessStepType } from './ServiceProcessStep';

export type CreateServiceProcessStepDto = {
  type: ServiceProcessStepType;
  title: string;
  description?: string;
  nextRequestStatus: ServiceRequestStatus;
  owners: UUID[];
  prevStepsOnReject?: UUID[];
  prevStepsOnApprove?: UUID[];
  nextStepOnReject?: UUID;
  nextStepOnApprove?: UUID;
};

export default CreateServiceProcessStepDto;
