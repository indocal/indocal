import { FormGeneratorFormFieldAnswer } from '../../types';

export function parseNumberFormFieldAnswer(
  answer: FormGeneratorFormFieldAnswer<number | null>
): FormGeneratorFormFieldAnswer<number | null> {
  return {
    field: answer.field,
    content:
      typeof answer.content === 'number' && !isNaN(answer.content)
        ? answer.content
        : null,
  };
}

export default parseNumberFormFieldAnswer;
