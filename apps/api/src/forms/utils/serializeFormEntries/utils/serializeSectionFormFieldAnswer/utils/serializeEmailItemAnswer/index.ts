import {
  SectionFormFieldItemAnswer,
  EmailFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeEmailItemAnswer(
  answer: SectionFormFieldItemAnswer
): SerializedAnswer {
  const content = answer.content as EmailFormFieldAnswer;

  return content || 'N/A';
}

export default serializeEmailItemAnswer;
