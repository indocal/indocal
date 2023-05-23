import { PrismaService } from 'nestjs-prisma';

import {
  TableFormFieldColumnAnswer,
  UsersFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export async function serializeUsersColumnAnswer(
  answer: TableFormFieldColumnAnswer,
  client: PrismaService
): Promise<SerializedAnswer> {
  const content = answer.content as UsersFormFieldAnswer;

  if (!content) return 'N/A';

  if (typeof content === 'string') {
    const user = await client.user.findUnique({
      where: { id: content },
    });

    return user ? user.username : 'N/A';
  }

  const users = await client.user.findMany({
    where: { id: { in: content } },
  });

  return users.length > 0
    ? users.map((user) => user.username).join(', ') || 'N/A'
    : 'N/A';
}

export default serializeUsersColumnAnswer;
