import { UUID } from '../../../../../common';

import { FormFieldAnswer } from '../../../../forms';

export type CreateServiceRequestDto = {
  answers: FormFieldAnswer[];
  service: UUID;
  requestedBy: UUID;
};

export default CreateServiceRequestDto;
