import {
  TableFormFieldColumnAnswer,
  RatingFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeRatingColumnAnswer(
  answer: TableFormFieldColumnAnswer
): SerializedAnswer {
  const content = answer.content as RatingFormFieldAnswer;

  return content ?? 'N/A';
}

export default serializeRatingColumnAnswer;
