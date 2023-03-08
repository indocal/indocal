import { TableFormFieldColumnAnswer } from '../../types';

export function parseSelectColumnAnswer(
  answer: TableFormFieldColumnAnswer<string | string[] | null>
): TableFormFieldColumnAnswer<string | string[] | null> {
  return { column: answer.column, content: answer.content || null };
}

export default parseSelectColumnAnswer;
