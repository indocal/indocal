import { User } from '@indocal/services';

import { FormGeneratorAnswer } from '../../types';

export function parseUsersFormFieldAnswer(
  answer: FormGeneratorAnswer<User | User[]>
): FormGeneratorAnswer<User | User[]> {
  return { field: answer.field, content: answer.content || null };
}

export default parseUsersFormFieldAnswer;
