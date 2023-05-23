import {
  SectionFormFieldItemAnswer,
  RadioFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeRadioItemAnswer(
  answer: SectionFormFieldItemAnswer
): SerializedAnswer {
  const content = answer.content as RadioFormFieldAnswer;

  return content || 'N/A';
}

export default serializeRadioItemAnswer;
