import {
  Prisma,
  FormEntry as DBFormEntryModel,
  Form as DBFormModel,
  User as DBUserModel,
} from '@prisma/client';
import { Exclude } from 'class-transformer';

import { Entity, UUID } from '@/common';
import { UserEntity } from '@/auth';

import { FormEntity } from '../../../entities';

type Include = Partial<{
  form?: DBFormModel;
  answeredBy?: DBUserModel | null;
}>;

export class FormEntryEntity implements Entity, DBFormEntryModel {
  form?: FormEntity;
  answeredBy?: UserEntity | null;

  constructor(entry: DBFormEntryModel, include?: Include) {
    Object.assign(this, entry);

    if (include?.form) {
      this.form = new FormEntity(include.form);
    }

    this.answeredBy = include?.answeredBy
      ? new UserEntity(include.answeredBy)
      : null;
  }

  id: UUID;
  answers: Prisma.JsonValue[];

  @Exclude()
  formId: string;

  @Exclude()
  answeredById: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export default FormEntryEntity;
