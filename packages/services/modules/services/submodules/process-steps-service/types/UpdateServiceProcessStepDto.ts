import { UUID } from '../../../../../common';

import { ServiceRequestStatus } from '../../requests-service';

export type UpdateServiceProcessStepDto = Partial<{
  title: string;
  description: string | null;
  nextRequestStatus: ServiceRequestStatus;
  owners: UUID[];
  prevStepOnReject: UUID | null;
  prevStepOnApprove: UUID | null;
  nextStepOnReject: UUID | null;
  nextStepOnApprove: UUID | null;
}>;

export default UpdateServiceProcessStepDto;
