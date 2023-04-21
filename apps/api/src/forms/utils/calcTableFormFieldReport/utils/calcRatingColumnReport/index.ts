import {
  TableFormFieldColumnReport,
  RatingFormFieldReport,
} from '../../../../types';

import { TableFormFieldColumnAnswer } from '../../../../submodules/entries/entities';

export function calcRatingColumnReport(
  answer: TableFormFieldColumnAnswer,
  map: Map<string, TableFormFieldColumnReport>
): void {
  const record = map.get(answer.column.id);

  if (record) {
    const content = record.content as RatingFormFieldReport;

    if (typeof answer.content === 'number') {
      const total = content.average * content.count + answer.content;

      map.set(answer.column.id, {
        column: answer.column,
        content: {
          count: content.count + 1,
          na: content.na,
          average: total / (content.count + 1),
        },
      });
    } else {
      map.set(answer.column.id, {
        column: answer.column,
        content: {
          count: content.count,
          na: content.na + 1,
          average: content.average,
        },
      });
    }
  } else {
    if (typeof answer.content === 'number') {
      map.set(answer.column.id, {
        column: answer.column,
        content: {
          count: 1,
          na: 0,
          average: answer.content,
        },
      });
    } else {
      map.set(answer.column.id, {
        column: answer.column,
        content: {
          count: 0,
          na: 1,
          average: 0,
        },
      });
    }
  }
}
