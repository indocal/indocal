import { isValid } from 'date-fns';

import { FormGeneratorFormFieldAnswer } from '../../types';

export function parseDateTimeFormFieldAnswer(
  answer: FormGeneratorFormFieldAnswer<Date | null>
): FormGeneratorFormFieldAnswer<string | null> {
  return {
    field: answer.field,
    content:
      answer.content && isValid(answer.content)
        ? new Date(answer.content).toISOString()
        : null,
  };
}

export default parseDateTimeFormFieldAnswer;
