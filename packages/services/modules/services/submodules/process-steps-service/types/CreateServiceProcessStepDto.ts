import { UUID } from '../../../../../common';

export type CreateServiceProcessStepDto = {
  title: string;
  description?: string;
  owners: UUID[];
  prevFailureStep?: UUID;
  prevSuccessStep?: UUID;
  nextFailureStep?: UUID;
  nextSuccessStep?: UUID;
};

export default CreateServiceProcessStepDto;
