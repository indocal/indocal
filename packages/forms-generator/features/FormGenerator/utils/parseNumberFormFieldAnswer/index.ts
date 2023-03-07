import { FormGeneratorAnswer } from '../../types';

export function parseNumberFormFieldAnswer(
  answer: FormGeneratorAnswer<number>
): FormGeneratorAnswer<number> {
  return {
    field: answer.field,
    content:
      typeof answer.content === 'number' && !isNaN(answer.content)
        ? answer.content
        : null,
  };
}

export default parseNumberFormFieldAnswer;
