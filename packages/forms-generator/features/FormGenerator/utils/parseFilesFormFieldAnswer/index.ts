import { FormGeneratorAnswer } from '../../types';

export function parseFilesFormFieldAnswer(
  answer: FormGeneratorAnswer<File[]>
): FormGeneratorAnswer<File[]> {
  return { field: answer.field, content: answer.content || null };
}

export default parseFilesFormFieldAnswer;
