import {
  SectionFormFieldItemAnswer,
  DniFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeDniItemAnswer(
  answer: SectionFormFieldItemAnswer
): SerializedAnswer {
  const content = answer.content as DniFormFieldAnswer;

  return content || 'N/A';
}

export default serializeDniItemAnswer;
