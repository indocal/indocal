import { UUID } from '@/common';

import {
  FormFieldAnswer,
  RadioFormFieldAnswer,
} from '../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../types';

export function serializeRadioFormFieldAnswer(
  answer: FormFieldAnswer,
  map: Map<UUID, SerializedAnswer>
): void {
  const content = answer.content as RadioFormFieldAnswer;

  const serialized = content || 'N/A';

  map.set(answer.field.id, serialized);
}

export default serializeRadioFormFieldAnswer;
