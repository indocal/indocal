import { Exclude } from 'class-transformer';
import { FormEntry, FormFieldType, UserStatus } from '@prisma/client';

import { Entity, UUID } from '@/common';

import { FormFieldConfig } from '../../fields';

type User = {
  id: UUID;
  username: string;
  email: string;
  name: string;
  password: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

type FormField = {
  id: UUID;
  type: FormFieldType;
  title: string;
  description: string | null;
  config: FormFieldConfig | null;
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

export class FormEntryEntity implements Entity, FormEntry {
  constructor(entry: FormEntry) {
    Object.assign(this, entry);
  }

  id: UUID;
  answers: FormFieldAnswer[];

  @Exclude()
  answeredById: UUID | null;

  @Exclude()
  formId: UUID;

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
