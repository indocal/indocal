import { FormGeneratorAnswer } from '../../types';

export function parseSelectFormFieldAnswer(
  answer: FormGeneratorAnswer<string | string[]>
): FormGeneratorAnswer<string | string[]> {
  return { field: answer.field, content: answer.content || null };
}

export default parseSelectFormFieldAnswer;
