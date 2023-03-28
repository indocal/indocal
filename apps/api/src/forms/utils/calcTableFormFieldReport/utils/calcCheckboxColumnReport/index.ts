import {
  TableFormFieldColumnReport,
  CheckboxFormFieldReport,
} from '../../../../types';

import { TableFormFieldColumnAnswer } from '../../../../submodules/entries/entities';

export function calcCheckboxColumnReport(
  answer: TableFormFieldColumnAnswer,
  map: Map<string, TableFormFieldColumnReport>
): void {
  const record = map.get(answer.column.heading);

  if (record) {
    const content = record.content as CheckboxFormFieldReport;

    if (typeof answer.content === 'boolean') {
      if (answer.content) {
        map.set(answer.column.heading, {
          column: answer.column,
          content: {
            yes: content.yes + 1,
            no: content.no,
            na: content.na,
          },
        });
      } else {
        map.set(answer.column.heading, {
          column: answer.column,
          content: {
            yes: content.yes,
            no: content.no + 1,
            na: content.na,
          },
        });
      }
    } else {
      map.set(answer.column.heading, {
        column: answer.column,
        content: {
          yes: content.yes,
          no: content.no,
          na: content.na + 1,
        },
      });
    }
  } else {
    if (typeof answer.content === 'boolean') {
      if (answer.content) {
        map.set(answer.column.heading, {
          column: answer.column,
          content: {
            yes: 1,
            no: 0,
            na: 0,
          },
        });
      } else {
        map.set(answer.column.heading, {
          column: answer.column,
          content: {
            yes: 0,
            no: 1,
            na: 0,
          },
        });
      }
    } else {
      map.set(answer.column.heading, {
        column: answer.column,
        content: {
          yes: 0,
          no: 0,
          na: 1,
        },
      });
    }
  }
}
