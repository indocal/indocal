import { Entity } from '../../../../../common';

export type FormFieldType =
  | 'CHECKBOX'
  | 'EMAIL'
  | 'NUMBER'
  | 'RADIO'
  | 'TEXT'
  | 'TEXTAREA';

export interface FormField extends Entity {
  type: FormFieldType;
  title: string;
  description: string | null;
  config?: object;
  createdAt: string;
  updatedAt: string;
}

export default FormField;
