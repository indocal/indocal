import { FormGeneratorAnswers } from '@indocal/forms-generator';
import {
  INDOCAL,
  FormFieldAnswer,
  TableFormFieldAnswer,
} from '@indocal/services';

import {
  serializeTextColumnAnswer,
  serializeTextAreaColumnAnswer,
  serializeNumberColumnAnswer,
  serializeDniColumnAnswer,
  serializePhoneColumnAnswer,
  serializeEmailColumnAnswer,
  serializeCheckboxColumnAnswer,
  serializeSelectColumnAnswer,
  serializeRadioColumnAnswer,
  serializeTimeColumnAnswer,
  serializeDateColumnAnswer,
  serializeDateTimeColumnAnswer,
  serializeRatingColumnAnswer,
  serializeFilesColumnAnswer,
  serializeUsersColumnAnswer,
} from './utils';

export async function serializeTableFormFieldAnswer(
  answer: FormGeneratorAnswers[number],
  client: INDOCAL
): Promise<FormFieldAnswer> {
  const rows = answer.content as TableFormFieldAnswer | null;

  const serializers = {
    TEXT: serializeTextColumnAnswer,
    TEXTAREA: serializeTextAreaColumnAnswer,
    NUMBER: serializeNumberColumnAnswer,

    DNI: serializeDniColumnAnswer,
    PHONE: serializePhoneColumnAnswer,
    EMAIL: serializeEmailColumnAnswer,

    CHECKBOX: serializeCheckboxColumnAnswer,
    SELECT: serializeSelectColumnAnswer,
    RADIO: serializeRadioColumnAnswer,

    TIME: serializeTimeColumnAnswer,
    DATE: serializeDateColumnAnswer,
    DATETIME: serializeDateTimeColumnAnswer,

    RATING: serializeRatingColumnAnswer,

    FILES: serializeFilesColumnAnswer,

    USERS: serializeUsersColumnAnswer,
  };

  if (rows) {
    const promises = rows.map((row) =>
      Promise.all(
        row.map(({ column, content }) =>
          serializers[column.type]({ column, content }, client)
        )
      )
    );

    const data = await Promise.all(promises);

    return {
      field: answer.field,
      content: data,
    };
  }

  return {
    field: answer.field,
    content: null,
  };
}

export default serializeTableFormFieldAnswer;
