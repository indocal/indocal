import { FormGeneratorAnswers } from '@indocal/forms-generator';
import { FormFieldAnswer, UsersFormFieldConfig, User } from '@indocal/services';

export function serializeUsersFormFieldAnswer(
  answer: FormGeneratorAnswers[number]
): FormFieldAnswer {
  const config = answer.field.config as UsersFormFieldConfig | null;
  const content = answer.content as User | User[] | null;

  if (config?.multiple && Array.isArray(content)) {
    return {
      field: answer.field,
      content: content.map((user) => user.id),
    };
  }

  if (content && !Array.isArray(content)) {
    return {
      field: answer.field,
      content: content.id,
    };
  }

  return {
    field: answer.field,
    content: null,
  };
}

export default serializeUsersFormFieldAnswer;
