import {
  TableFormFieldColumnAnswer,
  CheckboxFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeCheckboxColumnAnswer(
  answer: TableFormFieldColumnAnswer
): SerializedAnswer {
  const content = answer.content as CheckboxFormFieldAnswer;

  return typeof content === 'boolean' ? (content ? 'Sí' : 'No') : 'N/A';
}

export default serializeCheckboxColumnAnswer;
