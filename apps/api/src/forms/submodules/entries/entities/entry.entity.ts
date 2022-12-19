import { Exclude } from 'class-transformer';
import {
  FormEntry as DBFormEntryModel,
  Form as DBFormModel,
  FormFieldType as DBFormFieldTypeEnum,
  User as DBUserModel,
  UserStatus as DBUserStatusEnum,
} from '@prisma/client';

import { Entity, UUID } from '@/common';
import { UserEntity } from '@/auth';

import { FormEntity } from '../../../entities';

import { FormFieldConfig } from '../../fields';

type Include = Partial<{
  form?: DBFormModel;
  answeredBy?: DBUserModel | null;
}>;

type FormField = {
  id: UUID;
  type: DBFormFieldTypeEnum;
  title: string;
  description: string | null;
  config: FormFieldConfig | null;
  createdAt: string;
  updatedAt: string;
};

type User = {
  id: UUID;
  username: string;
  email: string;
  password: string;
  status: DBUserStatusEnum;
  createdAt: string;
  updatedAt: string;
};

export type FormFieldAnswer = {
  field: FormField;
  content:
    | TextFormFieldAnswer
    | TextAreaFormFieldAnswer
    | NumberFormFieldAnswer
    | DniFormFieldAnswer
    | PhoneFormFieldAnswer
    | EmailFormFieldAnswer
    | CheckboxFormFieldAnswer
    | SelectFormFieldAnswer
    | RadioFormFieldAnswer
    | TimeFormFieldAnswer
    | DateFormFieldAnswer
    | DateTimeFormFieldAnswer
    | UsersFormFieldAnswer
    | SectionFormFieldAnswer
    | TableFormFieldAnswer
    | null;
};

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
  answers: FormFieldAnswer[];

  @Exclude()
  formId: string;

  @Exclude()
  answeredById: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export default FormEntryEntity;

////////////////////
// Answer by type //
////////////////////

export type TextFormFieldAnswer = string;

export type TextAreaFormFieldAnswer = string;

export type NumberFormFieldAnswer = number;

export type DniFormFieldAnswer = string;

export type PhoneFormFieldAnswer = string;

export type EmailFormFieldAnswer = string;

export type CheckboxFormFieldAnswer = boolean;

export type SelectFormFieldAnswer = string | string[];

export type RadioFormFieldAnswer = string;

export type TimeFormFieldAnswer = string;

export type DateFormFieldAnswer = string;

export type DateTimeFormFieldAnswer = string;

export type UsersFormFieldAnswer = User | User[];

export type SectionFormFieldAnswer = Record<
  string,
  | TextFormFieldAnswer
  | TextAreaFormFieldAnswer
  | NumberFormFieldAnswer
  | DniFormFieldAnswer
  | PhoneFormFieldAnswer
  | EmailFormFieldAnswer
  | CheckboxFormFieldAnswer
  | SelectFormFieldAnswer
  | RadioFormFieldAnswer
  | TimeFormFieldAnswer
  | DateFormFieldAnswer
  | DateTimeFormFieldAnswer
  | UsersFormFieldAnswer
  | null
>;

export type TableFormFieldAnswer = Array<
  Record<
    string,
    | TextFormFieldAnswer
    | TextAreaFormFieldAnswer
    | NumberFormFieldAnswer
    | DniFormFieldAnswer
    | PhoneFormFieldAnswer
    | EmailFormFieldAnswer
    | CheckboxFormFieldAnswer
    | SelectFormFieldAnswer
    | RadioFormFieldAnswer
    | TimeFormFieldAnswer
    | DateFormFieldAnswer
    | DateTimeFormFieldAnswer
    | UsersFormFieldAnswer
    | null
  >
>;
