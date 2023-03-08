import { SectionFormFieldItemAnswer } from '../../types';

export function parseCheckboxItemAnswer(
  answer: SectionFormFieldItemAnswer<boolean | null>
): SectionFormFieldItemAnswer<boolean | null> {
  return {
    item: answer.item,
    content:
      answer.content !== null && answer.content !== undefined
        ? Boolean(answer.content)
        : null,
  };
}

export default parseCheckboxItemAnswer;
