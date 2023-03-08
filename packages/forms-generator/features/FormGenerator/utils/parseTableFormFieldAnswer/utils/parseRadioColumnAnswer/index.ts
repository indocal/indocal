import { TableFormFieldColumnAnswer } from '../../types';

export function parseRadioColumnAnswer(
  answer: TableFormFieldColumnAnswer<string | null>
): TableFormFieldColumnAnswer<string | null> {
  return { column: answer.column, content: answer.content || null };
}

export default parseRadioColumnAnswer;
