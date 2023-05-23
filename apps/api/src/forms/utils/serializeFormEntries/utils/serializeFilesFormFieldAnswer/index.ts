import { PrismaService } from 'nestjs-prisma';

import { UUID } from '@/common';

import {
  FormFieldAnswer,
  FilesFormFieldAnswer,
} from '../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../types';

export async function serializeFilesFormFieldAnswer(
  answer: FormFieldAnswer,
  map: Map<UUID, SerializedAnswer>,
  client: PrismaService
): Promise<void> {
  const content = answer.content as FilesFormFieldAnswer;

  if (!content) {
    const serialized = 'N/A';

    map.set(answer.field.id, serialized);

    return;
  }

  if (typeof content === 'string') {
    const file = await client.file.findUnique({
      where: { id: content },
    });

    const serialized = file ? file.path : 'N/A';

    map.set(answer.field.id, serialized);

    return;
  }

  const files = await client.file.findMany({
    where: { id: { in: content } },
  });

  const serialized =
    files.length > 0
      ? files.map((file) => file.path).join(', ') || 'N/A'
      : 'N/A';

  map.set(answer.field.id, serialized);
}

export default serializeFilesFormFieldAnswer;
