import { UUID } from '@/common';

import {
  FormFieldAnswer,
  CheckboxFormFieldAnswer,
} from '../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../types';

export function serializeCheckboxFormFieldAnswer(
  answer: FormFieldAnswer,
  map: Map<UUID, SerializedAnswer>
): void {
  const content = answer.content as CheckboxFormFieldAnswer;

  const serialized =
    typeof content === 'boolean' ? (content ? 'Sí' : 'No') : 'N/A';

  map.set(answer.field.id, serialized);
}

export default serializeCheckboxFormFieldAnswer;
