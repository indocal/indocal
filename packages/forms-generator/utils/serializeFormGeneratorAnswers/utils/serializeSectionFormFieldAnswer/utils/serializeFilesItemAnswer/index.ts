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
    const { files, error } = await client.uploads.files.upload(content);

    if (error) throw error;

    return {
      item: answer.item,
      content: files.map((file) => file.id),
    };
  }

  if (content) {
    const { files, error } = await client.uploads.files.upload(content);

    if (error) throw error;

    const [file] = files;

    return {
      item: answer.item,
      content: file ? file.id : null,
    };
  }

  return {
    item: answer.item,
    content: null,
  };
}

export default serializeFilesItemAnswer;
