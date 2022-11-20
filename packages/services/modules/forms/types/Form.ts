import { Entity, UUID } from '../../../common';

import { FormFieldType, FormFieldConfig } from '../submodules';

type Field = {
  id: UUID;
  type: FormFieldType;
  title: string;
  description: string | null;
  config: FormFieldConfig | null;
  createdAt: string;
  updatedAt: string;
};

type Group = {
  id: UUID;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type FormStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
export type FormVisibility = 'PUBLIC' | 'PROTECTED' | 'PRIVATE';

export interface Form extends Entity {
  slug: string;
  title: string;
  description: string | null;
  status: FormStatus;
  visibility: FormVisibility;
  fields: Field[];
  group: Group;
  createdAt: string;
  updatedAt: string;
}

export default Form;
