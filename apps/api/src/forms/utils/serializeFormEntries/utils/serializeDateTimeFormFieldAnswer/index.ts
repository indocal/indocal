import { isValid } from 'date-fns';

import { UUID } from '@/common';

import {
  FormFieldAnswer,
  DateTimeFormFieldAnswer,
} from '../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../types';

export function serializeDateTimeFormFieldAnswer(
  answer: FormFieldAnswer,
  map: Map<UUID, SerializedAnswer>
): void {
  const content = answer.content as DateTimeFormFieldAnswer;

  const serialized =
    content && isValid(new Date(content))
      ? new Date(content).toLocaleString()
      : 'N/A';

  map.set(answer.field.id, serialized);
}

export default serializeDateTimeFormFieldAnswer;
