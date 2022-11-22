import { UUID } from '../../../../../common';

export type CreateFormEntryDto = {
  answers: object;
  form: UUID;
  sentBy?: UUID;
};

export default CreateFormEntryDto;
