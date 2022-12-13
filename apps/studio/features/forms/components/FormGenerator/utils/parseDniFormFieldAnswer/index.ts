import { formatDni } from '@indocal/ui';
import { Form } from '@indocal/services';

import { FormFieldAnswer } from '../../types';

export function parseDniFormFieldAnswer(
  field: Form['fields'][number],
  answer: FormFieldAnswer['content']
): FormFieldAnswer {
  return { field, content: answer ? formatDni(answer as string, 'DB') : null };
}

export default parseDniFormFieldAnswer;
