import { Form, FormFieldAnswer } from '@indocal/services';

export function parseEmailFormFieldAnswer(
  field: Form['fields'][number],
  answer: FormFieldAnswer['content']
): FormFieldAnswer {
  return { field, content: answer || null };
}

export default parseEmailFormFieldAnswer;
