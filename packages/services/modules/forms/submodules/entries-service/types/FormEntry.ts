import { Entity, UUID } from '../../../../../common';

import { User, UserStatus } from '../../../../auth';

import { Form, FormStatus, FormVisibility, FormConfig } from '../../../types';

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
    | UsersFormFieldAnswer
    | SectionFormFieldAnswer
    | TableFormFieldAnswer
    | null;
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

type AnsweredBy = {
  id: UUID;
  username: string;
  email: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

export interface FormEntry extends Entity {
  answers: FormFieldAnswer[];
  form: EntryForm;
  answeredBy: AnsweredBy | null;
  createdAt: string;
  updatedAt: string;
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
