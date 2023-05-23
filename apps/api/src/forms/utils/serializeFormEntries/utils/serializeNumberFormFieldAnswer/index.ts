import { UUID } from '@/common';

import {
  FormFieldAnswer,
  NumberFormFieldAnswer,
} from '../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../types';

export function serializeNumberFormFieldAnswer(
  answer: FormFieldAnswer,
  map: Map<UUID, SerializedAnswer>
): void {
  const content = answer.content as NumberFormFieldAnswer;

  const serialized = content ?? 'N/A';

  map.set(answer.field.id, serialized);
}

export default serializeNumberFormFieldAnswer;
