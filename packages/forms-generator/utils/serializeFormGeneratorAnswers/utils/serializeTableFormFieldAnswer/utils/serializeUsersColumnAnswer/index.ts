import {
  TableFormFieldColumnAnswer,
  UsersFormFieldConfig,
  User,
} from '@indocal/services';

export function serializeUsersColumnAnswer(
  answer: TableFormFieldColumnAnswer
): TableFormFieldColumnAnswer {
  const config = answer.column.config as UsersFormFieldConfig | null;
  const content = answer.content as User | User[] | null;

  if (config?.multiple && Array.isArray(content)) {
    return {
      column: answer.column,
      content: content.map((user) => user.id),
    };
  }

  if (content && !Array.isArray(content)) {
    return {
      column: answer.column,
      content: content.id,
    };
  }

  return {
    column: answer.column,
    content: null,
  };
}

export default serializeUsersColumnAnswer;
