import { TableFormFieldColumnAnswer } from '../../types';

export function parseRatingColumnAnswer(
  answer: TableFormFieldColumnAnswer<number | null>
): TableFormFieldColumnAnswer<number | null> {
  return {
    column: answer.column,
    content:
      typeof answer.content === 'number' && !isNaN(answer.content)
        ? answer.content
        : null,
  };
}

export default parseRatingColumnAnswer;
