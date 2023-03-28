import {
  TableFormFieldColumnReport,
  SelectFormFieldReport,
} from '../../../../types';

import { TableFormFieldColumnAnswer } from '../../../../submodules/entries/entities';

export function calcSelectColumnReport(
  answer: TableFormFieldColumnAnswer,
  map: Map<string, TableFormFieldColumnReport>
): void {
  const record = map.get(answer.column.heading);

  if (record) {
    const content = record.content as SelectFormFieldReport;

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
    } else if (Array.isArray(answer.content)) {
      const options = answer.content as string[];

      const record = map.get(answer.column.heading);

      if (!record) return;

      const content = record.content as SelectFormFieldReport;

      options.forEach((option) => {
        map.set(answer.column.heading, {
          column: answer.column,
          content: {
            ...content,
            na: content.na,
            [option]: content[option] ? content[option] + 1 : 1,
          },
        });
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
    } else if (Array.isArray(answer.content)) {
      const options = answer.content as string[];

      map.set(answer.column.heading, {
        column: answer.column,
        content: {
          na: 0,
        },
      });

      options.forEach((option) => {
        const record = map.get(answer.column.heading);

        if (!record) return;

        const content = record.content as SelectFormFieldReport;

        map.set(answer.column.heading, {
          column: answer.column,
          content: {
            ...content,
            [option]: 1,
            na: 0,
          },
        });
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
