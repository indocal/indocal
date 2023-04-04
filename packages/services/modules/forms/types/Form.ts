import { Entity } from '../../../common';

import { FormFieldType, FormFieldConfig } from '../submodules';

type Field = Entity & {
  type: FormFieldType;
  title: string;
  description: string | null;
  config: FormFieldConfig | null;
};

type Group = Entity & {
  name: string;
  description: string | null;
};

export type FormStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
export type FormVisibility = 'PUBLIC' | 'PROTECTED' | 'PRIVATE';

export type FormConfig = Partial<{
  webhooks: FormWebhook[];
}>;

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

////////////////////////
// FormConfig Schemas //
////////////////////////

export type FormWebhook = {
  name: string;
  url: string;
};
