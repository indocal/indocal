import { formatPhone } from '@indocal/ui';

import { SectionFormFieldItemAnswer } from '../../types';

export function parsePhoneItemAnswer(
  answer: SectionFormFieldItemAnswer<string | null>
): SectionFormFieldItemAnswer<string | null> {
  return {
    item: answer.item,
    content: answer.content ? formatPhone(answer.content, 'DB') : null,
  };
}

export default parsePhoneItemAnswer;
