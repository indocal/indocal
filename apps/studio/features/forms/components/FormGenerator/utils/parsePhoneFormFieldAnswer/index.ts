import { formatPhone } from '@indocal/ui';
import { Form } from '@indocal/services';

import { FormFieldAnswer } from '../../types';

export function parsePhoneFormFieldAnswer(
  field: Form['fields'][number],
  answer: FormFieldAnswer['content']
): FormFieldAnswer {
  return {
    field,
    content: answer ? formatPhone(answer as string, 'DB') : null,
  };
}

export default parsePhoneFormFieldAnswer;
