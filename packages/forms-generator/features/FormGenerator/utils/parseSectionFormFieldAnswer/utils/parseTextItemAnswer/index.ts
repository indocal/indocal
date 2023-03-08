import { SectionFormFieldItemAnswer } from '../../types';

export function parseTextItemAnswer(
  answer: SectionFormFieldItemAnswer<string | null>
): SectionFormFieldItemAnswer<string | null> {
  return {
    item: answer.item,
    content: answer.content ? answer.content.trim() || null : null,
  };
}

export default parseTextItemAnswer;
