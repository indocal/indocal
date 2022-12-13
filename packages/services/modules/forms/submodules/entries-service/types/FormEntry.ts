import { Entity, UUID } from '../../../../../common';

import { User, UserStatus } from '../../../../auth';

import { Form as FORM, FormStatus, FormVisibility } from '../../../types';

export type FormFieldAnswer = {
  field: FORM['fields'][number];
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

type Form = {
  id: UUID;
  slug: string;
  title: string;
  description: string | null;
  status: FormStatus;
  visibility: FormVisibility;
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
  form: Form;
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

export type TimeFormFieldAnswer = Date;

export type DateFormFieldAnswer = Date;

export type DateTimeFormFieldAnswer = Date;

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
