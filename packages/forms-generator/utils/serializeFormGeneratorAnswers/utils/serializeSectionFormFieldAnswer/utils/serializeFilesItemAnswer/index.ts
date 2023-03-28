import {
  INDOCAL,
  SectionFormFieldItemAnswer,
  FilesFormFieldConfig,
} from '@indocal/services';

export async function serializeFilesItemAnswer(
  answer: SectionFormFieldItemAnswer,
  client: INDOCAL
): Promise<SectionFormFieldItemAnswer> {
  const config = answer.item.config as FilesFormFieldConfig | null;
  const content = answer.content as File[] | null;

  if (config?.multiple && content) {
    const { files } = await client.uploads.files.upload(content);

    return {
      item: answer.item,
      content: files.map((file) => file.id),
    };
  }

  if (content) {
    const { files } = await client.uploads.files.upload(content);

    return {
      item: answer.item,
      content: files.length > 0 ? files[0].id : null,
    };
  }

  return {
    item: answer.item,
    content: null,
  };
}

export default serializeFilesItemAnswer;
