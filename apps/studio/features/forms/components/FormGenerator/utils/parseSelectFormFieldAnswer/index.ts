import { Form } from '@indocal/services';

import { FormFieldAnswer } from '../../types';

export function parseSelectFormFieldAnswer(
  field: Form['fields'][number],
  answer: FormFieldAnswer['content']
): FormFieldAnswer {
  return { field, content: answer || null };
}

export default parseSelectFormFieldAnswer;
