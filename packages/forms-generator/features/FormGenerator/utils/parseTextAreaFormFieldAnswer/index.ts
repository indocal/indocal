import { FormGeneratorFormFieldAnswer } from '../../types';

export function parseTextAreaFormFieldAnswer(
  answer: FormGeneratorFormFieldAnswer<string | null>
): FormGeneratorFormFieldAnswer<string | null> {
  return {
    field: answer.field,
    content: answer.content ? answer.content.trim() || null : null,
  };
}

export default parseTextAreaFormFieldAnswer;
