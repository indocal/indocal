import { FormGeneratorAnswers } from '@indocal/forms-generator';
import {
  INDOCAL,
  FormFieldAnswer,
  FilesFormFieldConfig,
} from '@indocal/services';

export async function serializeFilesFormFieldAnswer(
  answer: FormGeneratorAnswers[number],
  client: INDOCAL
): Promise<FormFieldAnswer> {
  const config = answer.field.config as FilesFormFieldConfig | null;
  const content = answer.content as File[] | null;

  if (config?.multiple && content) {
    const { files, error } = await client.uploads.files.upload(content);

    if (error) throw error;

    return {
      field: answer.field,
      content: files.map((file) => file.id),
    };
  }

  if (content) {
    const { files, error } = await client.uploads.files.upload(content);

    if (error) throw error;

    const [file] = files;

    return {
      field: answer.field,
      content: file ? file.id : null,
    };
  }

  return {
    field: answer.field,
    content: null,
  };
}

export default serializeFilesFormFieldAnswer;
