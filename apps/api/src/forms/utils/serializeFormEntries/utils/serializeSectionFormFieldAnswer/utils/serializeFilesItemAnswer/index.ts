import { PrismaService } from 'nestjs-prisma';

import {
  SectionFormFieldItemAnswer,
  FilesFormFieldAnswer,
} from '../../../../../../submodules/entries/entities';

import { SerializedAnswer } from '../../../../types';

export async function serializeFilesItemAnswer(
  answer: SectionFormFieldItemAnswer,
  client: PrismaService
): Promise<SerializedAnswer> {
  const content = answer.content as FilesFormFieldAnswer;

  if (!content) return 'N/A';

  if (typeof content === 'string') {
    const file = await client.file.findUnique({
      where: { id: content },
    });

    return file ? file.path : 'N/A';
  }

  const files = await client.file.findMany({
    where: { id: { in: content } },
  });

  return files.length > 0
    ? files.map((file) => file.path).join(', ') || 'N/A'
    : 'N/A';
}

export default serializeFilesItemAnswer;
