import { FormGeneratorAnswer } from '../../types';

export function parseCheckboxFormFieldAnswer(
  answer: FormGeneratorAnswer<boolean>
): FormGeneratorAnswer<boolean> {
  return {
    field: answer.field,
    content:
      answer.content !== null && answer.content !== undefined
        ? Boolean(answer.content)
        : null,
  };
}

export default parseCheckboxFormFieldAnswer;
