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
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FormStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
export type FormVisibility = 'PUBLIC' | 'PROTECTED' | 'PRIVATE';

export type FormConfig = Partial<{
  webhooks: FormWebhook[];
}>;

export type FormWebhook = {
  name: string;
  url: string;
};

export interface Form extends Entity {
  slug: string;
  title: string;
  description: string | null;
  status: FormStatus;
  visibility: FormVisibility;
  config: FormConfig | null;
  fields: Field[];
  group: Group;
}

export default Form;
