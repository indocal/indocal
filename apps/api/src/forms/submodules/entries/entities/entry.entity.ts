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

export class FormEntryEntity implements Entity, DBFormEntryModel {
  form?: FormEntity;
  sentBy?: UserEntity | null;

  constructor(
    entry: DBFormEntryModel,
    form?: DBFormModel,
    sentBy?: DBUserModel
  ) {
    Object.assign(this, entry);

    if (form) {
      this.form = new FormEntity(form);
    }

    this.sentBy = sentBy ? new UserEntity(sentBy) : null;
  }

  id: UUID;
  answers: Prisma.JsonValue[];

  @Exclude()
  formId: string;

  @Exclude()
  sentById: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export default FormEntryEntity;
