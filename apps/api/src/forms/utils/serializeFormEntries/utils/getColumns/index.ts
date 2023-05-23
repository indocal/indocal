import { UUID } from '@/common';

import {
  FormEntryEntity,
  SectionFormFieldAnswer,
  TableFormFieldAnswer,
} from '../../../../submodules/entries/entities';

import { Column } from '../../types';

export function getColumns(records: FormEntryEntity[]): Column[] {
  const columns: Map<UUID, Column> = new Map();

  records.forEach((record) => {
    record.answers.forEach((answer) => {
      switch (answer.field.type) {
        case 'SECTION': {
          const content = answer.content as SectionFormFieldAnswer;

          content.forEach(({ item }) => {
            if (!columns.has(item.id)) {
              columns.set(item.id, {
                id: item.id,
                title: `(${answer.field.title}) ${item.title}`,
              });
            }
          });
          break;
        }

        case 'TABLE': {
          const content = answer.content as TableFormFieldAnswer;

          content.forEach((row) => {
            row.forEach(({ column }) => {
              if (!columns.has(column.id)) {
                columns.set(column.id, {
                  id: column.id,
                  title: `(${answer.field.title}) ${column.heading}`,
                });
              }
            });
          });
          break;
        }

        default: {
          if (!columns.has(answer.field.id)) {
            columns.set(answer.field.id, {
              id: answer.field.id,
              title: answer.field.title,
            });
          }
          break;
        }
      }
    });
  });

  return Array.from(columns.values());
}

export default getColumns;
