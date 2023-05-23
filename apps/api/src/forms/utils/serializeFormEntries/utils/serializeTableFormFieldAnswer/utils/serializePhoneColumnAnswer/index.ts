import {
  TableFormFieldColumnAnswer,
  PhoneFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializePhoneColumnAnswer(
  answer: TableFormFieldColumnAnswer
): SerializedAnswer {
  const content = answer.content as PhoneFormFieldAnswer;

  return content || 'N/A';
}

export default serializePhoneColumnAnswer;
