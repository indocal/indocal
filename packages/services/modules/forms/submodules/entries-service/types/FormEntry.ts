import { Entity, UUID } from '../../../../../common';

import { UserStatus } from '../../../../auth';

import { Form, FormStatus, FormVisibility, FormConfig } from '../../../types';

type File = {
  id: UUID;
  path: string;
  mime: string;
  extension: string;
  size: number;
  dimensions: number[];
  name: string;
  caption: string | null;
  alt: string | null;
  createdAt: string;
  updatedAt: string;
};

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

export type FormFieldAnswer = {
  field: Form['fields'][number];
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
    | FilesFormFieldAnswer
    | UsersFormFieldAnswer
    | SectionFormFieldAnswer
    | TableFormFieldAnswer
    | null;
};

type AnsweredBy = {
  id: UUID;
  username: string;
  email: string;
  name: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

type EntryForm = {
  id: UUID;
  slug: string;
  title: string;
  description: string | null;
  status: FormStatus;
  visibility: FormVisibility;
  config: FormConfig | null;
  createdAt: string;
  updatedAt: string;
};

export interface FormEntry extends Entity {
  answers: FormFieldAnswer[];
  answeredBy: AnsweredBy | null;
  form: EntryForm;
}

export default FormEntry;

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

export type FilesFormFieldAnswer = File | File[];

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
