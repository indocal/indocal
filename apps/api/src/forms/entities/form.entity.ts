import {
  Form as DBFormModel,
  FormStatus as DBFormStatusEnum,
  FormVisibility as DBFormVisibilityEnum,
  FormField as DBFormFieldModel,
  UserGroup as DBUserGroupModel,
} from '@prisma/client';
import { Exclude } from 'class-transformer';

import { Entity, UUID } from '@/common';
import { UserGroupEntity } from '@/auth';

import { FormFieldEntity } from '../submodules';

export class FormEntity implements Entity, DBFormModel {
  fields?: FormFieldEntity[];
  group?: UserGroupEntity;

  constructor(
    form: DBFormModel,
    fields?: DBFormFieldModel[],
    group?: DBUserGroupModel
  ) {
    Object.assign(this, form);

    if (fields) {
      this.fields = fields
        .map((field) => new FormFieldEntity(field))
        .sort((a, b) => (a.order === b.order ? 0 : a.order > b.order ? 1 : -1));
    }

    if (group) {
      this.group = new UserGroupEntity(group);
    }
  }

  id: UUID;
  slug: string;
  title: string;
  description: string | null;
  status: DBFormStatusEnum;
  visibility: DBFormVisibilityEnum;

  @Exclude()
  groupId: string;

  createdAt: Date;
  updatedAt: Date;
}

export default FormEntity;
