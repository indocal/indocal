import {
  SectionFormFieldItemAnswer,
  TextFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeTextItemAnswer(
  answer: SectionFormFieldItemAnswer
): SerializedAnswer {
  const content = answer.content as TextFormFieldAnswer;

  return content || 'N/A';
}

export default serializeTextItemAnswer;
