import { FormGeneratorFormFieldAnswer } from '../../types';

export function parseFilesFormFieldAnswer(
  answer: FormGeneratorFormFieldAnswer<File[] | null>
): FormGeneratorFormFieldAnswer<File[] | null> {
  return { field: answer.field, content: answer.content || null };
}

export default parseFilesFormFieldAnswer;
