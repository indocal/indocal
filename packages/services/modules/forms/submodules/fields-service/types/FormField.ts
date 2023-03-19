import { Entity, UUID } from '../../../../../common';

import { FormStatus, FormVisibility, FormConfig } from '../../../types';

type Form = {
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

export type FormFieldType =
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
  | 'USERS'
  | 'SECTION'
  | 'TABLE';

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
  | FilesFormFieldConfig
  | UsersFormFieldConfig
  | SectionFormFieldConfig
  | TableFormFieldConfig
>;

export interface FormField extends Entity {
  type: FormFieldType;
  title: string;
  description: string | null;
  config: FormFieldConfig | null;
  form: Form;
}

export default FormField;

////////////////////
// Config by type //
////////////////////

export type FormFieldHintConfig = {
  include: boolean;
  position: 'BEFORE' | 'AFTER';
  content: string | null;
};

export type FormFieldWebhookConfig = {
  include: boolean;
  key: string | null;
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
