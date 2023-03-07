import { isValid } from 'date-fns';

import { FormGeneratorAnswer } from '../../types';

export function parseTimeFormFieldAnswer(
  answer: FormGeneratorAnswer<Date>
): FormGeneratorAnswer<string> {
  return {
    field: answer.field,
    content:
      answer.content && isValid(answer.content)
        ? new Date(answer.content).toISOString()
        : null,
  };
}

export default parseTimeFormFieldAnswer;
