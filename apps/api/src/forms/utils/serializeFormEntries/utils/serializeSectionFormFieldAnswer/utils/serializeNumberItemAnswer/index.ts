import {
  SectionFormFieldItemAnswer,
  NumberFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeNumberItemAnswer(
  answer: SectionFormFieldItemAnswer
): SerializedAnswer {
  const content = answer.content as NumberFormFieldAnswer;

  return content ?? 'N/A';
}

export default serializeNumberItemAnswer;
