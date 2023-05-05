import { UUID } from '../../../../../common';

export type UpdateServiceProcessStepDto = Partial<{
  title: string;
  description: string | null;
  owners: UUID[];
  prevFailureStep: UUID | null;
  prevSuccessStep: UUID | null;
  nextFailureStep: UUID | null;
  nextSuccessStep: UUID | null;
}>;

export default UpdateServiceProcessStepDto;
