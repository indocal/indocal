import { UUID } from '../../../../../common';

import { FormFieldAnswer } from '../../../../forms';

export type CreateServiceRequestDto = {
  formAnswers: FormFieldAnswer[];
  requestedBy: UUID;
  service: UUID;
};

export default CreateServiceRequestDto;
