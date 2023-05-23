import { isValid } from 'date-fns';

import {
  TableFormFieldColumnAnswer,
  DateFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeDateColumnAnswer(
  answer: TableFormFieldColumnAnswer
): SerializedAnswer {
  const content = answer.content as DateFormFieldAnswer;

  return content && isValid(new Date(content))
    ? new Date(content).toLocaleDateString()
    : 'N/A';
}

export default serializeDateColumnAnswer;
