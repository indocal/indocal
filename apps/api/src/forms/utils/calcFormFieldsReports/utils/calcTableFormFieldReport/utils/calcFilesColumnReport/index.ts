import { UUID } from '@/common';

import {
  TableFormFieldColumnReport,
  FilesFormFieldReport,
} from '../../../../../../types';

import { TableFormFieldColumnAnswer } from '../../../../../../submodules/entries/entities';

export function calcFilesColumnReport(
  answer: TableFormFieldColumnAnswer,
  map: Map<string, TableFormFieldColumnReport>
): void {
  const record = map.get(answer.column.id);

  if (record) {
    const content = record.content as FilesFormFieldReport;

    if (typeof answer.content === 'string') {
      map.set(answer.column.id, {
        column: answer.column,
        content: {
          count: content.count + 1,
          na: content.na,
          lastAnswers: [answer.content].concat(content.lastAnswers.slice(0, 2)),
        },
      });
    } else if (Array.isArray(answer.content)) {
      const files = answer.content as UUID[];

      files.forEach((file) => {
        const record = map.get(answer.column.id);

        if (!record) return;

        const content = record.content as FilesFormFieldReport;

        map.set(answer.column.id, {
          column: answer.column,
          content: {
            count: content.count + 1,
            na: content.na,
            lastAnswers: [file].concat(content.lastAnswers.slice(0, 2)),
          },
        });
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
    } else if (Array.isArray(answer.content)) {
      const files = answer.content as UUID[];

      map.set(answer.column.id, {
        column: answer.column,
        content: {
          count: 0,
          na: 0,
          lastAnswers: [],
        },
      });

      files.forEach((file) => {
        const record = map.get(answer.column.id);

        if (!record) return;

        const content = record.content as FilesFormFieldReport;

        map.set(answer.column.id, {
          column: answer.column,
          content: {
            count: content.count + 1,
            na: content.na,
            lastAnswers: [file].concat(content.lastAnswers.slice(0, 2)),
          },
        });
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
