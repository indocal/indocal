import { UUID } from '../../../../../common';

export type CreateServiceProcessStepDto = {
  title: string;
  description?: string;
  owners: UUID[];
};

export default CreateServiceProcessStepDto;
