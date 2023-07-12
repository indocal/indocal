import {
  INDOCAL,
  TableFormFieldColumnAnswer,
  FilesFormFieldConfig,
} from '@indocal/services';

export async function serializeFilesColumnAnswer(
  answer: TableFormFieldColumnAnswer,
  client: INDOCAL
): Promise<TableFormFieldColumnAnswer> {
  const config = answer.column.config as FilesFormFieldConfig | null;
  const content = answer.content as File[] | null;

  if (config?.multiple && content) {
    const { files, error } = await client.uploads.files.upload(content);

    if (error) throw error;

    return {
      column: answer.column,
      content: files.map((file) => file.id),
    };
  }

  if (content) {
    const { files, error } = await client.uploads.files.upload(content);

    if (error) throw error;

    const [file] = files;

    return {
      column: answer.column,
      content: file ? file.id : null,
    };
  }

  return {
    column: answer.column,
    content: null,
  };
}

export default serializeFilesColumnAnswer;
