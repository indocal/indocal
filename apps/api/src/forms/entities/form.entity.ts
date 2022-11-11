import {
  Form as DBFormModel,
  FormStatus as DBFormStatusEnum,
  FormVisibility as DBFormVisibilityEnum,
  FormField as DBFormFieldModel,
} from '@prisma/client';

import { Entity, UUID } from '@/common';

import { FormFieldEntity } from '../submodules';

export class FormEntity implements Entity, DBFormModel {
  fields?: FormFieldEntity[];

  constructor(form: DBFormModel, fields?: DBFormFieldModel[]) {
    Object.assign(this, form);

    if (fields) {
      this.fields = fields
        .map((field) => new FormFieldEntity(field))
        .sort((a, b) => (a.order === b.order ? 0 : a.order > b.order ? 1 : -1));
    }
  }

  id: UUID;
  slug: string;
  title: string;
  description: string | null;
  status: DBFormStatusEnum;
  visibility: DBFormVisibilityEnum;
  createdAt: Date;
  updatedAt: Date;
}

export default FormEntity;
