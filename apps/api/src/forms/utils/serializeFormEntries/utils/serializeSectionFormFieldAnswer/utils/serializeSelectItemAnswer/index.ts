import {
  SectionFormFieldItemAnswer,
  SelectFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export function serializeSelectItemAnswer(
  answer: SectionFormFieldItemAnswer
): SerializedAnswer {
  const content = answer.content as SelectFormFieldAnswer;

  if (!content) return 'N/A';

  return typeof content === 'string'
    ? content || 'N/A'
    : content.join(', ') || 'N/A';
}

export default serializeSelectItemAnswer;
