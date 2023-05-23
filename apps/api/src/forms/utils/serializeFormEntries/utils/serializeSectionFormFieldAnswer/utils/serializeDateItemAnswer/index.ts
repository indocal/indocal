import { isValid } from 'date-fns';

import {
  SectionFormFieldItemAnswer,
  DateFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeDateItemAnswer(
  answer: SectionFormFieldItemAnswer
): SerializedAnswer {
  const content = answer.content as DateFormFieldAnswer;

  return content && isValid(new Date(content))
    ? new Date(content).toLocaleDateString()
    : 'N/A';
}

export default serializeDateItemAnswer;
