import {
  TableFormFieldColumnAnswer,
  TextFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeTextColumnAnswer(
  answer: TableFormFieldColumnAnswer
): SerializedAnswer {
  const content = answer.content as TextFormFieldAnswer;

  return content || 'N/A';
}

export default serializeTextColumnAnswer;
