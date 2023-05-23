import {
  TableFormFieldColumnAnswer,
  RadioFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeRadioColumnAnswer(
  answer: TableFormFieldColumnAnswer
): SerializedAnswer {
  const content = answer.content as RadioFormFieldAnswer;

  return content || 'N/A';
}

export default serializeRadioColumnAnswer;
