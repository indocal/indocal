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
  | 'USERS';

export interface FormField extends Entity {
  type: FormFieldType;
  title: string;
  description: string | null;
  config: object | null;
  createdAt: string;
  updatedAt: string;
}

export default FormField;
