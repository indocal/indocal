import { formatPhone } from '@indocal/ui';

import { TableFormFieldColumnAnswer } from '../../types';

export function parsePhoneColumnAnswer(
  answer: TableFormFieldColumnAnswer<string | null>
): TableFormFieldColumnAnswer<string | null> {
  return {
    column: answer.column,
    content: answer.content ? formatPhone(answer.content, 'DB') : null,
  };
}

export default parsePhoneColumnAnswer;
