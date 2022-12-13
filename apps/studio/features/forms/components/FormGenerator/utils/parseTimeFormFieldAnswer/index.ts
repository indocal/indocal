import { isValid } from 'date-fns';

import { Form } from '@indocal/services';

import { FormFieldAnswer } from '../../types';

export function parseTimeFormFieldAnswer(
  field: Form['fields'][number],
  answer: FormFieldAnswer['content']
): FormFieldAnswer {
  return { field, content: isValid(answer) ? answer : null };
}

export default parseTimeFormFieldAnswer;
