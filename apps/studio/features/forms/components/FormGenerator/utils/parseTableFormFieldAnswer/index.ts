import { Form, TableFormFieldConfig } from '@indocal/services';

import { FormFieldAnswer, TableFormFieldAnswer } from '../../types';

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

    USERS: parseUsersFormFieldAnswer,
  };

  return {
    field,
    content:
      rows && config && config.columns.length > 0
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
