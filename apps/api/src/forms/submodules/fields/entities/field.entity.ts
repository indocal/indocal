import {
  Prisma,
  FormField as DBFormFieldModel,
  FormFieldType as DBFormFieldTypeEnum,
} from '@prisma/client';
import { Exclude } from 'class-transformer';

import { Entity, UUID } from '@/common';

export class FormFieldEntity implements Entity, DBFormFieldModel {
  constructor(field: DBFormFieldModel) {
    Object.assign(this, field);
  }

  id: UUID;
  type: DBFormFieldTypeEnum;
  title: string;
  description: string | null;
  config: Prisma.JsonValue;

  @Exclude()
  formId: string;

  createdAt: Date;
  updatedAt: Date;
}

export default FormFieldEntity;
