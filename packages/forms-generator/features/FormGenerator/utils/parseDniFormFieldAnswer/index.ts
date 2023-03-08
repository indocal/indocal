import { formatDni } from '@indocal/ui';

import { FormGeneratorFormFieldAnswer } from '../../types';

export function parseDniFormFieldAnswer(
  answer: FormGeneratorFormFieldAnswer<string | null>
): FormGeneratorFormFieldAnswer<string | null> {
  return {
    field: answer.field,
    content: answer.content ? formatDni(answer.content, 'DB') : null,
  };
}

export default parseDniFormFieldAnswer;
