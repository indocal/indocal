import { Entity, UUID } from '../../../../../common';

import { UserStatus } from '../../../../auth';

import { FormStatus, FormVisibility } from '../../../types';

type Form = {
  id: UUID;
  slug: string;
  title: string;
  description: string | null;
  status: FormStatus;
  visibility: FormVisibility;
  createdAt: string;
  updatedAt: string;
};

type AnsweredBy = {
  id: UUID;
  username: string;
  email: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

export interface FormEntry extends Entity {
  answers: object[];
  form: Form;
  answeredBy: AnsweredBy | null;
  createdAt: string;
  updatedAt: string;
}

export default FormEntry;
