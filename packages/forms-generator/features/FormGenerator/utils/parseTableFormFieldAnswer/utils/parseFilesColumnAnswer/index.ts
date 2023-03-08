import { TableFormFieldColumnAnswer } from '../../types';

export function parseFilesColumnAnswer(
  answer: TableFormFieldColumnAnswer<File[] | null>
): TableFormFieldColumnAnswer<File[] | null> {
  return { column: answer.column, content: answer.content || null };
}

export default parseFilesColumnAnswer;
