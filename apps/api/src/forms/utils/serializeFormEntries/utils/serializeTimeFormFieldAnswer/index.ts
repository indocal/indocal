import { isValid } from 'date-fns';

import { UUID } from '@/common';

import {
  FormFieldAnswer,
  TimeFormFieldAnswer,
} from '../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../types';

export function serializeTimeFormFieldAnswer(
  answer: FormFieldAnswer,
  map: Map<UUID, SerializedAnswer>
): void {
  const content = answer.content as TimeFormFieldAnswer;

  const serialized =
    content && isValid(new Date(content))
      ? new Date(content).toLocaleTimeString()
      : 'N/A';

  map.set(answer.field.id, serialized);
}

export default serializeTimeFormFieldAnswer;
