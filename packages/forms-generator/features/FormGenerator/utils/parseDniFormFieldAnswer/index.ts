import { formatDni } from '@indocal/ui';

import { FormGeneratorAnswer } from '../../types';

export function parseDniFormFieldAnswer(
  answer: FormGeneratorAnswer<string>
): FormGeneratorAnswer<string> {
  return {
    field: answer.field,
    content: answer.content ? formatDni(answer.content, 'DB') : null,
  };
}

export default parseDniFormFieldAnswer;
