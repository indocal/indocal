import { FormGeneratorAnswers } from '@indocal/forms-generator';
import { FormFieldAnswer } from '@indocal/services';

export function serializeCheckboxFormFieldAnswer(
  answer: FormGeneratorAnswers[number]
): FormFieldAnswer {
  return answer as FormFieldAnswer;
}

export default serializeCheckboxFormFieldAnswer;
