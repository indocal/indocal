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
    const { files } = await client.uploads.files.upload(content);

    return {
      field: answer.field,
      content: files.map((file) => file.id),
    };
  }

  if (content) {
    const { files } = await client.uploads.files.upload(content);

    return {
      field: answer.field,
      content: files.length > 0 ? files[0].id : null,
    };
  }

  return {
    field: answer.field,
    content: null,
  };
}

export default serializeFilesFormFieldAnswer;
