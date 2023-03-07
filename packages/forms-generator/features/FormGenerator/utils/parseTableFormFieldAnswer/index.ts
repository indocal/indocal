import {
  Form,
  TableFormFieldConfig,
  FormFieldAnswer,
  TableFormFieldAnswer,
} from '@indocal/services';

import parseTextFormFieldAnswer from '../parseTextFormFieldAnswer';
import parseTextAreaFormFieldAnswer from '../parseTextAreaFormFieldAnswer';
import parseNumberFormFieldAnswer from '../parseNumberFormFieldAnswer';
import parseDniFormFieldAnswer from '../parseDniFormFieldAnswer';
import parsePhoneFormFieldAnswer from '../parsePhoneFormFieldAnswer';
import parseEmailFormFieldAnswer from '../parseEmailFormFieldAnswer';
import parseCheckboxFormFieldAnswer from '../parseCheckboxFormFieldAnswer';
import parseSelectFormFieldAnswer from '../parseSelectFormFieldAnswer';
import parseRadioFormFieldAnswer from '../parseRadioFormFieldAnswer';
import parseTimeFormFieldAnswer from '../parseTimeFormFieldAnswer';
import parseDateFormFieldAnswer from '../parseDateFormFieldAnswer';
import parseDateTimeFormFieldAnswer from '../parseDateTimeFormFieldAnswer';
import parseFilesFormFieldAnswer from '../parseFilesFormFieldAnswer';
import parseUsersFormFieldAnswer from '../parseUsersFormFieldAnswer';

export function parseTableFormFieldAnswer(
  field: Form['fields'][number],
  answer: FormFieldAnswer['content']
): FormFieldAnswer {
  const config = field.config as TableFormFieldConfig | null;
  const rows = answer as TableFormFieldAnswer | null;

  const parsers = {
    TEXT: parseTextFormFieldAnswer,
    TEXTAREA: parseTextAreaFormFieldAnswer,
    NUMBER: parseNumberFormFieldAnswer,

    DNI: parseDniFormFieldAnswer,
    PHONE: parsePhoneFormFieldAnswer,
    EMAIL: parseEmailFormFieldAnswer,

    CHECKBOX: parseCheckboxFormFieldAnswer,
    SELECT: parseSelectFormFieldAnswer,
    RADIO: parseRadioFormFieldAnswer,

    TIME: parseTimeFormFieldAnswer,
    DATE: parseDateFormFieldAnswer,
    DATETIME: parseDateTimeFormFieldAnswer,

    FILES: parseFilesFormFieldAnswer,

    USERS: parseUsersFormFieldAnswer,
  };

  return {
    field,
    content:
      rows && config && config.columns && config.columns.length > 0
        ? rows.map<TableFormFieldAnswer[number]>((_, row) =>
            config.columns.reduce<TableFormFieldAnswer[number]>(
              (prev, column) => {
                const { content } = parsers[column.type](
                  field,
                  rows[row][column.heading]
                );

                return {
                  ...prev,
                  [column.heading]:
                    content as TableFormFieldAnswer[number][string],
                };
              },
              {}
            )
          )
        : null,
  };
}

export default parseTableFormFieldAnswer;
