import { SectionFormFieldItemAnswer } from '../../types';

export function parseSelectItemAnswer(
  answer: SectionFormFieldItemAnswer<string | string[] | null>
): SectionFormFieldItemAnswer<string | string[] | null> {
  return { item: answer.item, content: answer.content || null };
}

export default parseSelectItemAnswer;
