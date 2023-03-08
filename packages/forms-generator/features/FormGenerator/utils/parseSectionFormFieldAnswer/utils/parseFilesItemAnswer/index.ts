import { SectionFormFieldItemAnswer } from '../../types';

export function parseFilesItemAnswer(
  answer: SectionFormFieldItemAnswer<File[] | null>
): SectionFormFieldItemAnswer<File[] | null> {
  return { item: answer.item, content: answer.content || null };
}

export default parseFilesItemAnswer;
