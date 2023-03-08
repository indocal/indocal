import { SectionFormFieldItemAnswer } from '../../types';

export function parseRadioItemAnswer(
  answer: SectionFormFieldItemAnswer<string | null>
): SectionFormFieldItemAnswer<string | null> {
  return { item: answer.item, content: answer.content || null };
}

export default parseRadioItemAnswer;
