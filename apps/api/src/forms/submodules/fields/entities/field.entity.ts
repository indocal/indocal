import { Exclude } from 'class-transformer';
import { FormField, FormFieldType } from '@prisma/client';

import { Entity, UUID } from '@/common';

export type FormFieldConfig = Partial<
  | TextFormFieldConfig
  | TextAreaFormFieldConfig
  | NumberFormFieldConfig
  | DniFormFieldConfig
  | PhoneFormFieldConfig
  | EmailFormFieldConfig
  | CheckboxFormFieldConfig
  | SelectFormFieldConfig
  | RadioFormFieldConfig
  | TimeFormFieldConfig
  | DateFormFieldConfig
  | DateTimeFormFieldConfig
  | RatingFormFieldConfig
  | NetPromoterScoreFormFieldConfig
  | FilesFormFieldConfig
  | UsersFormFieldConfig
  | SectionFormFieldConfig
  | TableFormFieldConfig
>;

export class FormFieldEntity implements Entity, FormField {
  constructor(field: FormField) {
    Object.assign(this, field);
  }

  id: UUID;
  type: FormFieldType;
  title: string;
  description: string | null;

  @Exclude()
  order: number;

  config: FormFieldConfig | null;

  @Exclude()
  formId: UUID;

  createdAt: Date;
  updatedAt: Date;
}

export default FormFieldEntity;

////////////////////
// Config by type //
////////////////////

export type FormFieldHintConfig = {
  include: boolean;
  position: 'BEFORE' | 'AFTER';
  content?: string | null;
};

export type FormFieldWebhookConfig = {
  include: boolean;
  key?: string | null;
};

export type CommonFormFieldConfig = {
  required: boolean;
  hint: FormFieldHintConfig;
  webhook: FormFieldWebhookConfig;
};

export type TextFormFieldConfig = CommonFormFieldConfig & {
  minLength: number;
  maxLength: number;
};

export type TextAreaFormFieldConfig = CommonFormFieldConfig & {
  minLength: number;
  maxLength: number;
};

export type NumberFormFieldConfig = CommonFormFieldConfig & {
  min: number;
  max: number;
};

export type DniFormFieldConfig = CommonFormFieldConfig;

export type PhoneFormFieldConfig = CommonFormFieldConfig;

export type EmailFormFieldConfig = CommonFormFieldConfig;

export type CheckboxFormFieldConfig = CommonFormFieldConfig;

export type SelectFormFieldConfig = CommonFormFieldConfig & {
  options: string[];
  multiple: boolean;
};

export type RadioFormFieldConfig = CommonFormFieldConfig & {
  options: string[];
};

export type TimeFormFieldConfig = CommonFormFieldConfig;

export type DateFormFieldConfig = CommonFormFieldConfig;

export type DateTimeFormFieldConfig = CommonFormFieldConfig;

export type RatingFormFieldConfig = CommonFormFieldConfig & {
  levels: number;
};

export type NetPromoterScoreFormFieldConfig = CommonFormFieldConfig;

export type FilesFormFieldConfig = CommonFormFieldConfig & {
  accept: string[];
  multiple: boolean;
  minFiles: number;
  maxFiles: number;
};

export type UsersFormFieldConfig = CommonFormFieldConfig & {
  multiple: boolean;
};

export type SectionFormFieldConfig = CommonFormFieldConfig & {
  items: SectionFormFieldItem[];
};

export type SectionFormFieldItem = {
  type: SectionFormFieldItemType;
  title: string;
  description: string | null;
  config: SectionFormFieldItemConfig | null;
};

export type SectionFormFieldItemType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'DNI'
  | 'PHONE'
  | 'EMAIL'
  | 'CHECKBOX'
  | 'SELECT'
  | 'RADIO'
  | 'TIME'
  | 'DATE'
  | 'DATETIME'
  | 'FILES'
  | 'USERS';

export type SectionFormFieldItemConfig = Partial<
  | TextFormFieldConfig
  | TextAreaFormFieldConfig
  | NumberFormFieldConfig
  | DniFormFieldConfig
  | PhoneFormFieldConfig
  | EmailFormFieldConfig
  | CheckboxFormFieldConfig
  | SelectFormFieldConfig
  | RadioFormFieldConfig
  | TimeFormFieldConfig
  | DateFormFieldConfig
  | DateTimeFormFieldConfig
  | FilesFormFieldConfig
  | UsersFormFieldConfig
>;

export type TableFormFieldConfig = CommonFormFieldConfig & {
  columns: TableFormFieldColumn[];
  minRows: number;
  maxRows: number;
};

export type TableFormFieldColumn = {
  type: TableFormFieldColumnType;
  heading: string;
  config: TableFormFieldColumnConfig | null;
};

export type TableFormFieldColumnType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'DNI'
  | 'PHONE'
  | 'EMAIL'
  | 'CHECKBOX'
  | 'SELECT'
  | 'RADIO'
  | 'TIME'
  | 'DATE'
  | 'DATETIME'
  | 'FILES'
  | 'USERS';

export type TableFormFieldColumnConfig = Partial<
  | TextFormFieldConfig
  | TextAreaFormFieldConfig
  | NumberFormFieldConfig
  | DniFormFieldConfig
  | PhoneFormFieldConfig
  | EmailFormFieldConfig
  | CheckboxFormFieldConfig
  | SelectFormFieldConfig
  | RadioFormFieldConfig
  | TimeFormFieldConfig
  | DateFormFieldConfig
  | DateTimeFormFieldConfig
  | FilesFormFieldConfig
  | UsersFormFieldConfig
>;
