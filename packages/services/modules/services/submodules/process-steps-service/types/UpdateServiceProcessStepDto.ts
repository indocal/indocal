import { UUID } from '../../../../../common';

export type UpdateServiceProcessStepDto = Partial<{
  title: string;
  description: string | null;
  owners: UUID[];
}>;

export default UpdateServiceProcessStepDto;
