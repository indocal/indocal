import { UUID } from '../../../../../common';

export type CreateFormEntryDto = {
  answers: object;
  form: UUID;
  answeredBy?: UUID;
};

export default CreateFormEntryDto;
