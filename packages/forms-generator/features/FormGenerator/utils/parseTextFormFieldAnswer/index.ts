import { FormGeneratorAnswer } from '../../types';

export function parseTextFormFieldAnswer(
  answer: FormGeneratorAnswer<string>
): FormGeneratorAnswer<string> {
  return {
    field: answer.field,
    content: answer.content ? answer.content.trim() || null : null,
  };
}

export default parseTextFormFieldAnswer;
