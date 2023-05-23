import { UUID } from '@/common';

import {
  FormFieldAnswer,
  PhoneFormFieldAnswer,
} from '../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../types';

export function serializePhoneFormFieldAnswer(
  answer: FormFieldAnswer,
  map: Map<UUID, SerializedAnswer>
): void {
  const content = answer.content as PhoneFormFieldAnswer;

  const serialized = content || 'N/A';

  map.set(answer.field.id, serialized);
}

export default serializePhoneFormFieldAnswer;
