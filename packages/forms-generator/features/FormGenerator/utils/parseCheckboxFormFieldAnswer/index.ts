import { FormGeneratorFormFieldAnswer } from '../../types';

export function parseCheckboxFormFieldAnswer(
  answer: FormGeneratorFormFieldAnswer<boolean | null>
): FormGeneratorFormFieldAnswer<boolean | null> {
  return {
    field: answer.field,
    content:
      answer.content !== null && answer.content !== undefined
        ? Boolean(answer.content)
        : null,
  };
}

export default parseCheckboxFormFieldAnswer;
