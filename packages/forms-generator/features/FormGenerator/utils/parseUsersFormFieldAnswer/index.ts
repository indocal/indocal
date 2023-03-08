import { User } from '@indocal/services';

import { FormGeneratorFormFieldAnswer } from '../../types';

export function parseUsersFormFieldAnswer(
  answer: FormGeneratorFormFieldAnswer<User | User[] | null>
): FormGeneratorFormFieldAnswer<User | User[] | null> {
  return { field: answer.field, content: answer.content || null };
}

export default parseUsersFormFieldAnswer;
