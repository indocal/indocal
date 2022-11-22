import { Entity, UUID } from '../../../../../common';

type Form = { id: UUID };
type SentBy = { id: UUID };

export interface FormEntry extends Entity {
  answers: object;
  form: Form;
  sentBy: SentBy | null;
  createdAt: string;
  updatedAt: string;
}

export default FormEntry;
