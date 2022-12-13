import { formatDni } from '@indocal/ui';
import { Form, FormFieldAnswer } from '@indocal/services';

export function parseDniFormFieldAnswer(
  field: Form['fields'][number],
  answer: FormFieldAnswer['content']
): FormFieldAnswer {
  return { field, content: answer ? formatDni(answer as string, 'DB') : null };
}

export default parseDniFormFieldAnswer;
