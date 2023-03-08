import { TableFormFieldColumnAnswer } from '../../types';

export function parseTextAreaColumnAnswer(
  answer: TableFormFieldColumnAnswer<string | null>
): TableFormFieldColumnAnswer<string | null> {
  return {
    column: answer.column,
    content: answer.content ? answer.content.trim() || null : null,
  };
}

export default parseTextAreaColumnAnswer;
