import { Form, FormFieldAnswer } from '@indocal/services';

export function parseSelectFormFieldAnswer(
  field: Form['fields'][number],
  answer: FormFieldAnswer['content']
): FormFieldAnswer {
  return { field, content: answer || null };
}

export default parseSelectFormFieldAnswer;
