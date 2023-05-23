import { PrismaService } from 'nestjs-prisma';

import { UUID } from '@/common';

import {
  FormFieldAnswer,
  UsersFormFieldAnswer,
} from '../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../types';

export async function serializeUsersFormFieldAnswer(
  answer: FormFieldAnswer,
  map: Map<UUID, SerializedAnswer>,
  client: PrismaService
): Promise<void> {
  const content = answer.content as UsersFormFieldAnswer;

  if (!content) {
    const serialized = 'N/A';

    map.set(answer.field.id, serialized);

    return;
  }

  if (typeof content === 'string') {
    const user = await client.user.findUnique({
      where: { id: content },
    });

    const serialized = user ? user.username : 'N/A';

    map.set(answer.field.id, serialized);

    return;
  }

  const users = await client.user.findMany({
    where: { id: { in: content } },
  });

  const serialized =
    users.length > 0
      ? users.map((user) => user.username).join(', ') || 'N/A'
      : 'N/A';

  map.set(answer.field.id, serialized);
}

export default serializeUsersFormFieldAnswer;
