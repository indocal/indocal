import { Entity, UUID } from '../../../../../common';

import { UserStatus } from '../../../../auth';

import { Form, FormStatus, FormVisibility, FormConfig } from '../../../types';

import {
  SectionFormFieldItem,
  TableFormFieldColumn,
} from '../../fields-service/types';

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

export type FilesFormFieldAnswer = UUID | UUID[];

export type UsersFormFieldAnswer = UUID | UUID[];

export type SectionFormFieldAnswer = SectionFormFieldItemAnswer[];

export type SectionFormFieldItemAnswer = {
  item: SectionFormFieldItem;
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
    | null;
};

export type TableFormFieldAnswer = TableFormFieldRowAnswer[];

export type TableFormFieldRowAnswer = TableFormFieldColumnAnswer[];

export type TableFormFieldColumnAnswer = {
  column: TableFormFieldColumn;
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
    | null;
};
