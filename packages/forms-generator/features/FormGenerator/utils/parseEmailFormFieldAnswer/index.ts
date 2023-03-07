import { FormGeneratorAnswer } from '../../types';

export function parseEmailFormFieldAnswer(
  answer: FormGeneratorAnswer<string>
): FormGeneratorAnswer<string> {
  return { field: answer.field, content: answer.content || null };
}

export default parseEmailFormFieldAnswer;
