import { Form, FormFieldAnswer } from '@indocal/services';

// TODO: implement correctly
export function parseFilesFormFieldAnswer(
  field: Form['fields'][number],
  answer: FormFieldAnswer['content']
): FormFieldAnswer {
  return { field, content: answer || null };
}

export default parseFilesFormFieldAnswer;
