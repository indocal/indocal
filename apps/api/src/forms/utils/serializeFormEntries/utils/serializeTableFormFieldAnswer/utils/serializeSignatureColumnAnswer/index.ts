import {
  TableFormFieldColumnAnswer,
  SignatureFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeSignatureColumnAnswer(
  answer: TableFormFieldColumnAnswer
): SerializedAnswer {
  const content = answer.content as SignatureFormFieldAnswer;

  return content || 'N/A';
}

export default serializeSignatureColumnAnswer;
