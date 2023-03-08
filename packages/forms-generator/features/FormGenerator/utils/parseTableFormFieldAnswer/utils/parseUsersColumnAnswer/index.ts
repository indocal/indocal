import { User } from '@indocal/services';

import { TableFormFieldColumnAnswer } from '../../types';

export function parseUsersColumnAnswer(
  answer: TableFormFieldColumnAnswer<User | User[] | null>
): TableFormFieldColumnAnswer<User | User[] | null> {
  return { column: answer.column, content: answer.content || null };
}

export default parseUsersColumnAnswer;
