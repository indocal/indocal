import { UUID } from '@/common';

import {
  FormFieldAnswer,
  RatingFormFieldAnswer,
} from '../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../types';

export function serializeRatingFormFieldAnswer(
  answer: FormFieldAnswer,
  map: Map<UUID, SerializedAnswer>
): void {
  const content = answer.content as RatingFormFieldAnswer;

  const serialized = content ?? 'N/A';

  map.set(answer.field.id, serialized);
}

export default serializeRatingFormFieldAnswer;
