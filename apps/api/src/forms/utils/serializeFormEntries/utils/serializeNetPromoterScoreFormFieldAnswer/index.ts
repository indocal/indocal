import { UUID } from '@/common';

import {
  FormFieldAnswer,
  NetPromoterScoreFormFieldAnswer,
} from '../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../types';

export function serializeNetPromoterScoreFormFieldAnswer(
  answer: FormFieldAnswer,
  map: Map<UUID, SerializedAnswer>
): void {
  const content = answer.content as NetPromoterScoreFormFieldAnswer;

  const serialized = content ?? 'N/A';

  map.set(answer.field.id, serialized);
}

export default serializeNetPromoterScoreFormFieldAnswer;
