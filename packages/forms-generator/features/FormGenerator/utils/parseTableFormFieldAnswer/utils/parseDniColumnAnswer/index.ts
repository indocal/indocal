import { formatDni } from '@indocal/ui';

import { TableFormFieldColumnAnswer } from '../../types';

export function parseDniColumnAnswer(
  answer: TableFormFieldColumnAnswer<string | null>
): TableFormFieldColumnAnswer<string | null> {
  return {
    column: answer.column,
    content: answer.content ? formatDni(answer.content, 'DB') : null,
  };
}

export default parseDniColumnAnswer;
