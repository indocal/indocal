import { SectionFormFieldItemAnswer } from '../../types';

export function parseNumberItemAnswer(
  answer: SectionFormFieldItemAnswer<number | null>
): SectionFormFieldItemAnswer<number | null> {
  return {
    item: answer.item,
    content:
      typeof answer.content === 'number' && !isNaN(answer.content)
        ? answer.content
        : null,
  };
}

export default parseNumberItemAnswer;
