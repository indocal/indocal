import { SectionFormFieldItemAnswer } from '../../types';

export function parseTextAreaItemAnswer(
  answer: SectionFormFieldItemAnswer<string | null>
): SectionFormFieldItemAnswer<string | null> {
  return {
    item: answer.item,
    content: answer.content ? answer.content.trim() || null : null,
  };
}

export default parseTextAreaItemAnswer;
