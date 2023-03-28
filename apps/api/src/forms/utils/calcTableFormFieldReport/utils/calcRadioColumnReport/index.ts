import {
  TableFormFieldColumnReport,
  RadioFormFieldReport,
} from '../../../../types';

import { TableFormFieldColumnAnswer } from '../../../../submodules/entries/entities';

export function calcRadioColumnReport(
  answer: TableFormFieldColumnAnswer,
  map: Map<string, TableFormFieldColumnReport>
): void {
  const record = map.get(answer.column.heading);

  if (record) {
    const content = record.content as RadioFormFieldReport;

    if (typeof answer.content === 'string') {
      map.set(answer.column.heading, {
        column: answer.column,
        content: {
          ...content,
          na: content.na,
          [answer.content]: content[answer.content]
            ? content[answer.content] + 1
            : 1,
        },
      });
    } else {
      map.set(answer.column.heading, {
        column: answer.column,
        content: {
          ...content,
          na: content.na + 1,
        },
      });
    }
  } else {
    if (typeof answer.content === 'string') {
      map.set(answer.column.heading, {
        column: answer.column,
        content: {
          [answer.content]: 1,
          na: 0,
        },
      });
    } else {
      map.set(answer.column.heading, {
        column: answer.column,
        content: {
          na: 1,
        },
      });
    }
  }
}
