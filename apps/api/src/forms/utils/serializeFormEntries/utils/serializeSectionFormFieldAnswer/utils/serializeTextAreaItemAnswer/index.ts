import {
  SectionFormFieldItemAnswer,
  TextAreaFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeTextAreaItemAnswer(
  answer: SectionFormFieldItemAnswer
): SerializedAnswer {
  const content = answer.content as TextAreaFormFieldAnswer;

  return content || 'N/A';
}

export default serializeTextAreaItemAnswer;
