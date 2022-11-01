import { Entity, UUID } from '../../../common';

import { FormFieldType } from '../submodules';

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
  fields: Field[];
  createdAt: string;
  updatedAt: string;
}

export default Form;
