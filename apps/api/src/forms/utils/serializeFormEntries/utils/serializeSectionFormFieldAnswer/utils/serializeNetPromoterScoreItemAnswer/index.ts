import {
  SectionFormFieldItemAnswer,
  NetPromoterScoreFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeNetPromoterScoreItemAnswer(
  answer: SectionFormFieldItemAnswer
): SerializedAnswer {
  const content = answer.content as NetPromoterScoreFormFieldAnswer;

  return content ?? 'N/A';
}

export default serializeNetPromoterScoreItemAnswer;
