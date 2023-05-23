import { isValid } from 'date-fns';

import {
  SectionFormFieldItemAnswer,
  DateTimeFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeDateTimeItemAnswer(
  answer: SectionFormFieldItemAnswer
): SerializedAnswer {
  const content = answer.content as DateTimeFormFieldAnswer;

  return content && isValid(new Date(content))
    ? new Date(content).toLocaleString()
    : 'N/A';
}

export default serializeDateTimeItemAnswer;
