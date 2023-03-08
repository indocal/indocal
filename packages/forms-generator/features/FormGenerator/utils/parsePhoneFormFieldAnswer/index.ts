import { formatPhone } from '@indocal/ui';

import { FormGeneratorFormFieldAnswer } from '../../types';

export function parsePhoneFormFieldAnswer(
  answer: FormGeneratorFormFieldAnswer<string | null>
): FormGeneratorFormFieldAnswer<string | null> {
  return {
    field: answer.field,
    content: answer.content ? formatPhone(answer.content, 'DB') : null,
  };
}

export default parsePhoneFormFieldAnswer;
