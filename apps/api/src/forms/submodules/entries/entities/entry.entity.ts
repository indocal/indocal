import { Exclude } from 'class-transformer';
import { FormEntry, FormFieldType } from '@prisma/client';

import { Entity, UUID } from '@/common';

import {
  FormFieldConfig,
  SectionFormFieldItem,
  TableFormFieldColumn,
} from '../../fields';

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
    | RatingFormFieldAnswer
    | NetPromoterScoreFormFieldAnswer
    | FilesFormFieldAnswer
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

export type RatingFormFieldAnswer = number;

export type NetPromoterScoreFormFieldAnswer = number;

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
    | RatingFormFieldAnswer
    | NetPromoterScoreFormFieldAnswer
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
    | RatingFormFieldAnswer
    | FilesFormFieldAnswer
    | UsersFormFieldAnswer
    | null;
};
