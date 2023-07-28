import {
  TableFormFieldConfig,
  TableFormFieldAnswer,
  TableFormFieldRowAnswer,
} from '@indocal/services';

import { FormGeneratorFormFieldAnswer } from '../../types';

import {
  parseTextColumnAnswer,
  parseTextAreaColumnAnswer,
  parseNumberColumnAnswer,
  parseDniColumnAnswer,
  parsePhoneColumnAnswer,
  parseEmailColumnAnswer,
  parseCheckboxColumnAnswer,
  parseSelectColumnAnswer,
  parseRadioColumnAnswer,
  parseTimeColumnAnswer,
  parseDateColumnAnswer,
  parseDateTimeColumnAnswer,
  parseRatingColumnAnswer,
  parseSignatureColumnAnswer,
  parseFilesColumnAnswer,
  parseUsersColumnAnswer,
} from './utils';

export type TableFormFieldFormData = Array<
  Record<
    string,
    | Parameters<typeof parseTextColumnAnswer>[number]['content']
    | Parameters<typeof parseTextAreaColumnAnswer>[number]['content']
    | Parameters<typeof parseNumberColumnAnswer>[number]['content']
    | Parameters<typeof parseDniColumnAnswer>[number]['content']
    | Parameters<typeof parsePhoneColumnAnswer>[number]['content']
    | Parameters<typeof parseEmailColumnAnswer>[number]['content']
    | Parameters<typeof parseCheckboxColumnAnswer>[number]['content']
    | Parameters<typeof parseSelectColumnAnswer>[number]['content']
    | Parameters<typeof parseRadioColumnAnswer>[number]['content']
    | Parameters<typeof parseTimeColumnAnswer>[number]['content']
    | Parameters<typeof parseDateColumnAnswer>[number]['content']
    | Parameters<typeof parseDateTimeColumnAnswer>[number]['content']
    | Parameters<typeof parseRatingColumnAnswer>[number]['content']
    | Parameters<typeof parseSignatureColumnAnswer>[number]['content']
    | Parameters<typeof parseFilesColumnAnswer>[number]['content']
    | Parameters<typeof parseUsersColumnAnswer>[number]['content']
  >
>;

export function parseTableFormFieldAnswer(
  answer: FormGeneratorFormFieldAnswer<TableFormFieldFormData | null>
): FormGeneratorFormFieldAnswer<TableFormFieldAnswer | null> {
  const config = answer.field.config as TableFormFieldConfig | null;
  const rows = answer.content;

  const parsers = {
    TEXT: parseTextColumnAnswer,
    TEXTAREA: parseTextAreaColumnAnswer,
    NUMBER: parseNumberColumnAnswer,

    DNI: parseDniColumnAnswer,
    PHONE: parsePhoneColumnAnswer,
    EMAIL: parseEmailColumnAnswer,

    CHECKBOX: parseCheckboxColumnAnswer,
    SELECT: parseSelectColumnAnswer,
    RADIO: parseRadioColumnAnswer,

    TIME: parseTimeColumnAnswer,
    DATE: parseDateColumnAnswer,
    DATETIME: parseDateTimeColumnAnswer,

    RATING: parseRatingColumnAnswer,

    SIGNATURE: parseSignatureColumnAnswer,

    FILES: parseFilesColumnAnswer,

    USERS: parseUsersColumnAnswer,
  };

  return {
    field: answer.field,
    content:
      rows && config && config.columns && config.columns.length > 0
        ? rows.map(
            (_, row) =>
              config.columns.map((column) =>
                parsers[column.type]({
                  column,
                  content: rows[row][column.id] as null,
                })
              ) as TableFormFieldRowAnswer
          )
        : null,
  };
}

export default parseTableFormFieldAnswer;
