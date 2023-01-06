import { isValid } from 'date-fns';

import { Form, FormFieldAnswer } from '@indocal/services';

export function parseTimeFormFieldAnswer(
  field: Form['fields'][number],
  answer: FormFieldAnswer['content']
): FormFieldAnswer {
  return {
    field,
    content: isValid(answer) ? new Date(answer as string).toISOString() : null,
  };
}

export default parseTimeFormFieldAnswer;
