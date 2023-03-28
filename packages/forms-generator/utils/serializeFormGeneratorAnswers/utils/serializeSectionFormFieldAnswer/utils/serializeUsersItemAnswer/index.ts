import {
  SectionFormFieldItemAnswer,
  UsersFormFieldConfig,
  User,
} from '@indocal/services';

export function serializeUsersItemAnswer(
  answer: SectionFormFieldItemAnswer
): SectionFormFieldItemAnswer {
  const config = answer.item.config as UsersFormFieldConfig | null;
  const content = answer.content as User | User[] | null;

  if (config?.multiple && Array.isArray(content)) {
    return {
      item: answer.item,
      content: content.map((user) => user.id),
    };
  }

  if (content && !Array.isArray(content)) {
    return {
      item: answer.item,
      content: content.id,
    };
  }

  return {
    item: answer.item,
    content: null,
  };
}

export default serializeUsersItemAnswer;
