import { UUID } from '../../../../../common';

export type UpdateServiceProcessStepDto = Partial<{
  title: string;
  description: string | null;
  owners: UUID[];
  prevStepOnReject: UUID | null;
  prevStepOnApprove: UUID | null;
  nextStepOnReject: UUID | null;
  nextStepOnApprove: UUID | null;
}>;

export default UpdateServiceProcessStepDto;
