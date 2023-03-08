import { formatDni } from '@indocal/ui';

import { SectionFormFieldItemAnswer } from '../../types';

export function parseDniItemAnswer(
  answer: SectionFormFieldItemAnswer<string | null>
): SectionFormFieldItemAnswer<string | null> {
  return {
    item: answer.item,
    content: answer.content ? formatDni(answer.content, 'DB') : null,
  };
}

export default parseDniItemAnswer;
