import { UUID } from '@/common';

import {
  FormFieldAnswer,
  DniFormFieldAnswer,
} from '../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../types';

export function serializeDniFormFieldAnswer(
  answer: FormFieldAnswer,
  map: Map<UUID, SerializedAnswer>
): void {
  const content = answer.content as DniFormFieldAnswer;

  const serialized = content || 'N/A';

  map.set(answer.field.id, serialized);
}

export default serializeDniFormFieldAnswer;
