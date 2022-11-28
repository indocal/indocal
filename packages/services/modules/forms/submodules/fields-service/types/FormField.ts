import { Entity } from '../../../../../common';

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
  | 'USERS'
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
  | UsersFormFieldConfig
  | TableFormFieldConfig
>;

export interface FormField extends Entity {
  type: FormFieldType;
  title: string;
  description: string | null;
  config: FormFieldConfig | null;
  createdAt: string;
  updatedAt: string;
}

export default FormField;

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

export type TableFormFieldConfig = CommonFormFieldConfig & {
  columns: TableFormFieldColumn[];
};

export type TableFormFieldColumn = {
  type: Exclude<FormFieldType, 'TABLE'>;
  heading: string;
};
