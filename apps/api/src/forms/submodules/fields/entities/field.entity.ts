import { Exclude } from 'class-transformer';
import {
  FormField as DBFormFieldModel,
  FormFieldType as DBFormFieldTypeEnum,
} from '@prisma/client';

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
  | UsersFormFieldConfig
  | SectionFormFieldConfig
  | TableFormFieldConfig
>;

export class FormFieldEntity implements Entity, DBFormFieldModel {
  constructor(field: DBFormFieldModel) {
    Object.assign(this, field);
  }

  id: UUID;
  type: DBFormFieldTypeEnum;
  title: string;
  description: string | null;

  @Exclude()
  order: number;

  config: FormFieldConfig | null;

  @Exclude()
  formId: string;

  createdAt: Date;
  updatedAt: Date;
}

export default FormFieldEntity;

////////////////////
// Config by type //
////////////////////

export type CommonFormFieldConfig = {
  required: boolean;
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
  | UsersFormFieldConfig
>;
