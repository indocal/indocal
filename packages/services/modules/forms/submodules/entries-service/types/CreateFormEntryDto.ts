import { UUID } from '../../../../../common';

import { FormFieldAnswer } from './FormEntry';

export type CreateFormEntryDto = {
  answers: FormFieldAnswer[];
  form: UUID;
  answeredBy?: UUID;
};

export default CreateFormEntryDto;
