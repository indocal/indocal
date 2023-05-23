import {
  SectionFormFieldItemAnswer,
  CheckboxFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeCheckboxItemAnswer(
  answer: SectionFormFieldItemAnswer
): SerializedAnswer {
  const content = answer.content as CheckboxFormFieldAnswer;

  return typeof content === 'boolean' ? (content ? 'Sí' : 'No') : 'N/A';
}

export default serializeCheckboxItemAnswer;
