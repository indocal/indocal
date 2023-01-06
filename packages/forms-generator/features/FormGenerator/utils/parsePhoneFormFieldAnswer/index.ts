import { formatPhone } from '@indocal/ui';
import { Form, FormFieldAnswer } from '@indocal/services';

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
