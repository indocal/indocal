import { FormGeneratorFormFieldAnswer } from '../../types';

export function parseEmailFormFieldAnswer(
  answer: FormGeneratorFormFieldAnswer<string | null>
): FormGeneratorFormFieldAnswer<string | null> {
  return { field: answer.field, content: answer.content || null };
}

export default parseEmailFormFieldAnswer;
