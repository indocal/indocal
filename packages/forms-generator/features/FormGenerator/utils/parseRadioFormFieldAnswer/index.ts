import { FormGeneratorAnswer } from '../../types';

export function parseRadioFormFieldAnswer(
  answer: FormGeneratorAnswer<string>
): FormGeneratorAnswer<string> {
  return { field: answer.field, content: answer.content || null };
}

export default parseRadioFormFieldAnswer;
