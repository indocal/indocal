import { isValid } from 'date-fns';

import { UUID } from '@/common';

import {
  FormFieldAnswer,
  DateFormFieldAnswer,
} from '../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../types';

export function serializeDateFormFieldAnswer(
  answer: FormFieldAnswer,
  map: Map<UUID, SerializedAnswer>
): void {
  const content = answer.content as DateFormFieldAnswer;

  const serialized =
    content && isValid(new Date(content))
      ? new Date(content).toLocaleDateString()
      : 'N/A';

  map.set(answer.field.id, serialized);
}

export default serializeDateFormFieldAnswer;
