import { isValid } from 'date-fns';

import {
  TableFormFieldColumnAnswer,
  DateTimeFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeDateTimeColumnAnswer(
  answer: TableFormFieldColumnAnswer
): SerializedAnswer {
  const content = answer.content as DateTimeFormFieldAnswer;

  return content && isValid(new Date(content))
    ? new Date(content).toLocaleString()
    : 'N/A';
}

export default serializeDateTimeColumnAnswer;
