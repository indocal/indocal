import {
  SectionFormFieldItemAnswer,
  SignatureFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeSignatureItemAnswer(
  answer: SectionFormFieldItemAnswer
): SerializedAnswer {
  const content = answer.content as SignatureFormFieldAnswer;

  return content || 'N/A';
}

export default serializeSignatureItemAnswer;
