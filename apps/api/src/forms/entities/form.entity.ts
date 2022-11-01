import {
  Form as DBFormModel,
  FormField as DBFormFieldModel,
} from '@prisma/client';

import { Entity, UUID } from '@/common';

import { FormFieldEntity } from '../submodules';

export class FormEntity implements Entity, DBFormModel {
  fields?: FormFieldEntity[];

  constructor(form: DBFormModel, fields?: DBFormFieldModel[]) {
    Object.assign(this, form);

    if (fields) {
      this.fields = fields.map((field) => new FormFieldEntity(field));
    }
  }

  id: UUID;
  slug: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default FormEntity;
