import {
  SectionFormFieldItemAnswer,
  RatingFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeRatingItemAnswer(
  answer: SectionFormFieldItemAnswer
): SerializedAnswer {
  const content = answer.content as RatingFormFieldAnswer;

  return content ?? 'N/A';
}

export default serializeRatingItemAnswer;
