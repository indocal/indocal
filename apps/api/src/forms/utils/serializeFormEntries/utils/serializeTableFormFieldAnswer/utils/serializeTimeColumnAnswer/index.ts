import { isValid } from 'date-fns';

import {
  TableFormFieldColumnAnswer,
  TimeFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeTimeColumnAnswer(
  answer: TableFormFieldColumnAnswer
): SerializedAnswer {
  const content = answer.content as TimeFormFieldAnswer;

  return content && isValid(new Date(content))
    ? new Date(content).toLocaleTimeString()
    : 'N/A';
}

export default serializeTimeColumnAnswer;
