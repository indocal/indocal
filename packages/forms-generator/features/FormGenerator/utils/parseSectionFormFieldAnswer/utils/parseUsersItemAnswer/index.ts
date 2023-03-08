import { User } from '@indocal/services';

import { SectionFormFieldItemAnswer } from '../../types';

export function parseUsersItemAnswer(
  answer: SectionFormFieldItemAnswer<User | User[] | null>
): SectionFormFieldItemAnswer<User | User[] | null> {
  return { item: answer.item, content: answer.content || null };
}

export default parseUsersItemAnswer;
