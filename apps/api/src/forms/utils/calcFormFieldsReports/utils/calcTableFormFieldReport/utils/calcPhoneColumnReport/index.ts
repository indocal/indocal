import {
  TableFormFieldColumnReport,
  PhoneFormFieldReport,
} from '../../../../../../types';

import { TableFormFieldColumnAnswer } from '../../../../../../submodules/entries/entities';

export function calcPhoneColumnReport(
  answer: TableFormFieldColumnAnswer,
  map: Map<string, TableFormFieldColumnReport>
): void {
  const record = map.get(answer.column.id);

  if (record) {
    const content = record.content as PhoneFormFieldReport;

    if (typeof answer.content === 'string') {
      map.set(answer.column.id, {
        column: answer.column,
        content: {
          count: content.count + 1,
          na: content.na,
          lastAnswers: [answer.content].concat(content.lastAnswers.slice(0, 2)),
        },
      });
    } else {
      map.set(answer.column.id, {
        column: answer.column,
        content: {
          count: content.count,
          na: content.na + 1,
          lastAnswers: content.lastAnswers,
        },
      });
    }
  } else {
    if (typeof answer.content === 'string') {
      map.set(answer.column.id, {
        column: answer.column,
        content: {
          count: 1,
          na: 0,
          lastAnswers: [answer.content],
        },
      });
    } else {
      map.set(answer.column.id, {
        column: answer.column,
        content: {
          count: 0,
          na: 1,
          lastAnswers: [],
        },
      });
    }
  }
}
