import { Form } from '@indocal/services';

import { FormFieldAnswer } from '../../types';

export function parseRadioFormFieldAnswer(
  field: Form['fields'][number],
  answer: FormFieldAnswer['content']
): FormFieldAnswer {
  return { field, content: answer || null };
}

export default parseRadioFormFieldAnswer;
