import { Exclude } from 'class-transformer';
import {
  Form as DBFormModel,
  FormStatus as DBFormStatusEnum,
  FormVisibility as DBFormVisibilityEnum,
  FormField as DBFormFieldModel,
  UserGroup as DBUserGroupModel,
} from '@prisma/client';

import { Entity, UUID } from '@/common';
import { UserGroupEntity } from '@/auth';

import { FormFieldEntity } from '../submodules';

type Include = Partial<{
  fields?: DBFormFieldModel[];
  group?: DBUserGroupModel;
}>;

export type FormWebhook = {
  name: string;
  url: string;
};

export type FormConfig = Partial<{
  webhooks: FormWebhook[];
}>;

export class FormEntity implements Entity, DBFormModel {
  fields?: FormFieldEntity[];
  group?: UserGroupEntity;

  constructor(form: DBFormModel, include?: Include) {
    Object.assign(this, form);

    if (include?.fields) {
      this.fields = include.fields
        .map((field) => new FormFieldEntity(field))
        .sort((a, b) => (a.order === b.order ? 0 : a.order > b.order ? 1 : -1));
    }

    if (include?.group) {
      this.group = new UserGroupEntity(include.group);
    }
  }

  id: UUID;
  slug: string;
  title: string;
  description: string | null;
  config: FormConfig | null;
  status: DBFormStatusEnum;
  visibility: DBFormVisibilityEnum;

  @Exclude()
  groupId: string;

  createdAt: Date;
  updatedAt: Date;
}

export default FormEntity;
