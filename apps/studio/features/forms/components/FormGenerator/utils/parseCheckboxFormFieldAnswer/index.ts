import { Form, FormFieldAnswer } from '@indocal/services';

export function parseCheckboxFormFieldAnswer(
  field: Form['fields'][number],
  answer: FormFieldAnswer['content']
): FormFieldAnswer {
  return {
    field,
    content: answer !== null && answer !== undefined ? Boolean(answer) : null,
  };
}

export default parseCheckboxFormFieldAnswer;
