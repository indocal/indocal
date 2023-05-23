import { isValid } from 'date-fns';

import {
  SectionFormFieldItemAnswer,
  TimeFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeTimeItemAnswer(
  answer: SectionFormFieldItemAnswer
): SerializedAnswer {
  const content = answer.content as TimeFormFieldAnswer;

  return content && isValid(new Date(content))
    ? new Date(content).toLocaleTimeString()
    : 'N/A';
}

export default serializeTimeItemAnswer;
