import { Form } from '@indocal/services';

export type FormGeneratorFormFieldAnswer<T> = {
  field: Form['fields'][number];
  content: T;
};

export default FormGeneratorFormFieldAnswer;
