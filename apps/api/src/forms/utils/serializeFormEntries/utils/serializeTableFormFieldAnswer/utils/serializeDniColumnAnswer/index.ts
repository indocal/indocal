import {
  TableFormFieldColumnAnswer,
  DniFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeDniColumnAnswer(
  answer: TableFormFieldColumnAnswer
): SerializedAnswer {
  const content = answer.content as DniFormFieldAnswer;

  return content || 'N/A';
}

export default serializeDniColumnAnswer;
