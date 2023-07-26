import { UUID } from '../../../../../common';

import { ServiceRequestStatus } from '../../requests-service';

import { ServiceProcessStepType } from './ServiceProcessStep';

export type UpdateServiceProcessStepDto = Partial<{
  type: ServiceProcessStepType;
  title: string;
  description: string | null;
  nextRequestStatus: ServiceRequestStatus;
  owners: UUID[];
  prevStepsOnReject: UUID[];
  prevStepsOnApprove: UUID[];
  nextStepOnReject: UUID | null;
  nextStepOnApprove: UUID | null;
}>;

export default UpdateServiceProcessStepDto;
