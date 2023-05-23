import {
  TableFormFieldColumnAnswer,
  NumberFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeNumberColumnAnswer(
  answer: TableFormFieldColumnAnswer
): SerializedAnswer {
  const content = answer.content as NumberFormFieldAnswer;

  return content ?? 'N/A';
}

export default serializeNumberColumnAnswer;
