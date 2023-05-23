import {
  TableFormFieldColumnAnswer,
  TextAreaFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeTextAreaColumnAnswer(
  answer: TableFormFieldColumnAnswer
): SerializedAnswer {
  const content = answer.content as TextAreaFormFieldAnswer;

  return content || 'N/A';
}

export default serializeTextAreaColumnAnswer;
