import { UUID } from '@/common';

import {
  FormFieldAnswer,
  EmailFormFieldAnswer,
} from '../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../types';

export function serializeEmailFormFieldAnswer(
  answer: FormFieldAnswer,
  map: Map<UUID, SerializedAnswer>
): void {
  const content = answer.content as EmailFormFieldAnswer;

  const serialized = content || 'N/A';

  map.set(answer.field.id, serialized);
}

export default serializeEmailFormFieldAnswer;
