import { UUID } from '@/common';

import {
  FormFieldAnswer,
  TextAreaFormFieldAnswer,
} from '../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../types';

export function serializeTextAreaFormFieldAnswer(
  answer: FormFieldAnswer,
  map: Map<UUID, SerializedAnswer>
): void {
  const content = answer.content as TextAreaFormFieldAnswer;

  const serialized = content || 'N/A';

  map.set(answer.field.id, serialized);
}

export default serializeTextAreaFormFieldAnswer;
