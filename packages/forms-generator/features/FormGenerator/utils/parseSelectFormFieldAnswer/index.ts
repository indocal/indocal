import { FormGeneratorFormFieldAnswer } from '../../types';

export function parseSelectFormFieldAnswer(
  answer: FormGeneratorFormFieldAnswer<string | string[] | null>
): FormGeneratorFormFieldAnswer<string | string[] | null> {
  return { field: answer.field, content: answer.content || null };
}

export default parseSelectFormFieldAnswer;
