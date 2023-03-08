import { FormGeneratorFormFieldAnswer } from '../../types';

export function parseRadioFormFieldAnswer(
  answer: FormGeneratorFormFieldAnswer<string | null>
): FormGeneratorFormFieldAnswer<string | null> {
  return { field: answer.field, content: answer.content || null };
}

export default parseRadioFormFieldAnswer;
