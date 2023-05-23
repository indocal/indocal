import {
  SectionFormFieldItemAnswer,
  PhoneFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializePhoneItemAnswer(
  answer: SectionFormFieldItemAnswer
): SerializedAnswer {
  const content = answer.content as PhoneFormFieldAnswer;

  return content || 'N/A';
}

export default serializePhoneItemAnswer;
