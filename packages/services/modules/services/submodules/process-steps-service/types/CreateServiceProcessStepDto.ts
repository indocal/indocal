import { UUID } from '../../../../../common';

export type CreateServiceProcessStepDto = {
  title: string;
  description?: string;
  owners: UUID[];
  prevStepOnReject?: UUID;
  prevStepOnApprove?: UUID;
  nextStepOnReject?: UUID;
  nextStepOnApprove?: UUID;
};

export default CreateServiceProcessStepDto;
