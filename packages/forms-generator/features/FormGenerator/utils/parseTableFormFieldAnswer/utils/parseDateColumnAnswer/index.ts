import { isValid } from 'date-fns';

import { TableFormFieldColumnAnswer } from '../../types';

export function parseDateColumnAnswer(
  answer: TableFormFieldColumnAnswer<Date | null>
): TableFormFieldColumnAnswer<string | null> {
  return {
    column: answer.column,
    content:
      answer.content && isValid(answer.content)
        ? new Date(answer.content).toISOString()
        : null,
  };
}

export default parseDateColumnAnswer;
