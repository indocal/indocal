import { Form } from '@indocal/services';

export type FormGeneratorAnswer<T> = {
  field: Form['fields'][number];
  content: T | null;
};

export default FormGeneratorAnswer;
