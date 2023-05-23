import {
  TableFormFieldColumnAnswer,
  EmailFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeEmailColumnAnswer(
  answer: TableFormFieldColumnAnswer
): SerializedAnswer {
  const content = answer.content as EmailFormFieldAnswer;

  return content || 'N/A';
}

export default serializeEmailColumnAnswer;
