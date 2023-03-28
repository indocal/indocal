import { UUID } from '@/common';

import {
  TableFormFieldColumnReport,
  UsersFormFieldReport,
} from '../../../../types';

import { TableFormFieldColumnAnswer } from '../../../../submodules/entries/entities';

export function calcUsersColumnReport(
  answer: TableFormFieldColumnAnswer,
  map: Map<string, TableFormFieldColumnReport>
): void {
  const record = map.get(answer.column.heading);

  if (record) {
    const content = record.content as UsersFormFieldReport;

    if (typeof answer.content === 'string') {
      map.set(answer.column.heading, {
        column: answer.column,
        content: {
          count: content.count + 1,
          na: content.na,
          lastAnswers: [answer.content].concat(content.lastAnswers.slice(0, 2)),
        },
      });
    } else if (Array.isArray(answer.content)) {
      const users = answer.content as UUID[];

      users.forEach((user) => {
        const record = map.get(answer.column.heading);

        if (!record) return;

        const content = record.content as UsersFormFieldReport;

        map.set(answer.column.heading, {
          column: answer.column,
          content: {
            count: content.count + 1,
            na: content.na,
            lastAnswers: [user].concat(content.lastAnswers.slice(0, 2)),
          },
        });
      });
    } else {
      map.set(answer.column.heading, {
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
      map.set(answer.column.heading, {
        column: answer.column,
        content: {
          count: 1,
          na: 0,
          lastAnswers: [answer.content],
        },
      });
    } else if (Array.isArray(answer.content)) {
      const users = answer.content as UUID[];

      map.set(answer.column.heading, {
        column: answer.column,
        content: {
          count: 0,
          na: 0,
          lastAnswers: [],
        },
      });

      users.forEach((user) => {
        const record = map.get(answer.column.heading);

        if (!record) return;

        const content = record.content as UsersFormFieldReport;

        map.set(answer.column.heading, {
          column: answer.column,
          content: {
            count: content.count + 1,
            na: content.na,
            lastAnswers: [user].concat(content.lastAnswers.slice(0, 2)),
          },
        });
      });
    } else {
      map.set(answer.column.heading, {
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
