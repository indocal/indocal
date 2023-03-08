import { isValid } from 'date-fns';

import { SectionFormFieldItemAnswer } from '../../types';

export function parseDateItemAnswer(
  answer: SectionFormFieldItemAnswer<Date | null>
): SectionFormFieldItemAnswer<string | null> {
  return {
    item: answer.item,
    content:
      answer.content && isValid(answer.content)
        ? new Date(answer.content).toISOString()
        : null,
  };
}

export default parseDateItemAnswer;
