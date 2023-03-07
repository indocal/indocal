import { formatPhone } from '@indocal/ui';

import { FormGeneratorAnswer } from '../../types';

export function parsePhoneFormFieldAnswer(
  answer: FormGeneratorAnswer<string>
): FormGeneratorAnswer<string> {
  return {
    field: answer.field,
    content: answer.content ? formatPhone(answer.content, 'DB') : null,
  };
}

export default parsePhoneFormFieldAnswer;
