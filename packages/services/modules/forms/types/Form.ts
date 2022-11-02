import { Entity, UUID } from '../../../common';

import { FormFieldType } from '../submodules';

export type FormStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
export type FormVisibility = 'PUBLIC' | 'PRIVATE';

type Field = {
  id: UUID;
  type: FormFieldType;
  title: string;
  description: string | null;
  config?: object;
  createdAt: string;
  updatedAt: string;
};

export interface Form extends Entity {
  slug: string;
  title: string;
  description: string | null;
  status: FormStatus;
  visibility: FormVisibility;
  fields: Field[];
  createdAt: string;
  updatedAt: string;
}

export default Form;
