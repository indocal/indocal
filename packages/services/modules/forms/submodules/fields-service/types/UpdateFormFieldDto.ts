import { FormFieldConfig } from './FormField';

export type UpdateFormFieldDto = Partial<{
  title: string;
  description: string | null;
  config: FormFieldConfig;
}>;

export default UpdateFormFieldDto;
