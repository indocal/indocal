import { Form, FormFieldAnswer } from '@indocal/services';

export function parseNumberFormFieldAnswer(
  field: Form['fields'][number],
  answer: FormFieldAnswer['content']
): FormFieldAnswer {
  return {
    field,
    content: typeof answer === 'number' && !isNaN(answer) ? answer : null,
  };
}

export default parseNumberFormFieldAnswer;
