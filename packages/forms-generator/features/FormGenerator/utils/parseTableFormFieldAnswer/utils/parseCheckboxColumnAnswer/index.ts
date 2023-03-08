import { TableFormFieldColumnAnswer } from '../../types';

export function parseCheckboxColumnAnswer(
  answer: TableFormFieldColumnAnswer<boolean | null>
): TableFormFieldColumnAnswer<boolean | null> {
  return {
    column: answer.column,
    content:
      answer.content !== null && answer.content !== undefined
        ? Boolean(answer.content)
        : null,
  };
}

export default parseCheckboxColumnAnswer;
