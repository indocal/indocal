import { FormFieldType } from './FormField';

export type CreateFormFieldDto = {
  type: FormFieldType;
  title: string;
  description?: string;
};

export default CreateFormFieldDto;
