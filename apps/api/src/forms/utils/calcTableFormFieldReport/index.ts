import { UUID } from '@/common';

import { FormFieldReport, TableFormFieldColumnReport } from '../../types';

import {
  FormEntryEntity,
  TableFormFieldAnswer,
  TableFormFieldColumnAnswer,
} from '../../submodules/entries/entities';
import { TableFormFieldConfig } from '../../submodules/fields/entities';

import {
  calcTextColumnReport,
  calcTextAreaColumnReport,
  calcNumberColumnReport,
  calcDniColumnReport,
  calcPhoneColumnReport,
  calcEmailColumnReport,
  calcCheckboxColumnReport,
  calcSelectColumnReport,
  calcRadioColumnReport,
  calcTimeColumnReport,
  calcDateColumnReport,
  calcDateTimeColumnReport,
  calcUsersColumnReport,
  calcRatingColumnReport,
  calcFilesColumnReport,
} from './utils';

export function calcTableFormFieldReport(
  answer: FormEntryEntity['answers'][number],
  map: Map<UUID, FormFieldReport>
): void {
  const helpers: Record<
    TableFormFieldAnswer[number][number]['column']['type'],
    (
      answer: TableFormFieldColumnAnswer,
      map: Map<string, TableFormFieldColumnReport>
    ) => void
  > = {
    TEXT: calcTextColumnReport,
    TEXTAREA: calcTextAreaColumnReport,
    NUMBER: calcNumberColumnReport,

    DNI: calcDniColumnReport,
    PHONE: calcPhoneColumnReport,
    EMAIL: calcEmailColumnReport,

    CHECKBOX: calcCheckboxColumnReport,
    SELECT: calcSelectColumnReport,
    RADIO: calcRadioColumnReport,

    TIME: calcTimeColumnReport,
    DATE: calcDateColumnReport,
    DATETIME: calcDateTimeColumnReport,

    RATING: calcRatingColumnReport,

    FILES: calcUsersColumnReport,

    USERS: calcFilesColumnReport,
  };

  const config = answer.field.config as TableFormFieldConfig | null;

  if (!config || config.columns.length === 0) return;

  const record = map.get(answer.field.id);

  if (record) {
    const content = answer.content as TableFormFieldAnswer | null;

    if (content) {
      const acc = record.content as TableFormFieldColumnReport[];

      const columns = new Map<string, TableFormFieldColumnReport>(
        acc.map((column) => [column.column.id, column])
      );

      content.forEach((row) => {
        row.forEach(({ column, content }) => {
          helpers[column.type]({ column, content }, columns);
        });
      });

      map.set(answer.field.id, {
        field: answer.field,
        content: Array.from(columns.values()),
      });
    }
  } else {
    const content = answer.content as TableFormFieldAnswer | null;

    if (content) {
      const columns = new Map<string, TableFormFieldColumnReport>();

      content.forEach((row) => {
        row.forEach(({ column, content }) => {
          helpers[column.type]({ column, content }, columns);
        });
      });

      map.set(answer.field.id, {
        field: answer.field,
        content: Array.from(columns.values()),
      });
    } else {
      map.set(answer.field.id, {
        field: answer.field,
        content: [],
      });
    }
  }
}
