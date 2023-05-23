import { UUID } from '@/common';

import {
  FormFieldAnswer,
  SelectFormFieldAnswer,
} from '../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../types';

export function serializeSelectFormFieldAnswer(
  answer: FormFieldAnswer,
  map: Map<UUID, SerializedAnswer>
): void {
  const content = answer.content as SelectFormFieldAnswer;

  if (!content) {
    const serialized = 'N/A';

    map.set(answer.field.id, serialized);

    return;
  }

  const serialized =
    typeof content === 'string'
      ? content || 'N/A'
      : content.join(', ') || 'N/A';

  map.set(answer.field.id, serialized);
}

export default serializeSelectFormFieldAnswer;
