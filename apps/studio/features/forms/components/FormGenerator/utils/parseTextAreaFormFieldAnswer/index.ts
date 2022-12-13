import { Form } from '@indocal/services';

import { FormFieldAnswer } from '../../types';

export function parseTextAreaFormFieldAnswer(
  field: Form['fields'][number],
  answer: FormFieldAnswer['content']
): FormFieldAnswer {
  return { field, content: answer ? String(answer).trim() || null : null };
}

export default parseTextAreaFormFieldAnswer;
