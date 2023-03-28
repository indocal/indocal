import { UUID } from '@/common';

import { FormFieldReport, SelectFormFieldReport } from '../../types';

import { FormEntryEntity } from '../../submodules/entries/entities';

export function calcSelectFormFieldReport(
  answer: FormEntryEntity['answers'][number],
  map: Map<UUID, FormFieldReport>
): void {
  const record = map.get(answer.field.id);

  if (record) {
    const content = record.content as SelectFormFieldReport;

    if (typeof answer.content === 'string') {
      map.set(answer.field.id, {
        field: answer.field,
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

      const record = map.get(answer.field.id);

      if (!record) return;

      const content = record.content as SelectFormFieldReport;

      options.forEach((option) => {
        map.set(answer.field.id, {
          field: answer.field,
          content: {
            ...content,
            na: content.na,
            [option]: content[option] ? content[option] + 1 : 1,
          },
        });
      });
    } else {
      map.set(answer.field.id, {
        field: answer.field,
        content: {
          ...content,
          na: content.na + 1,
        },
      });
    }
  } else {
    if (typeof answer.content === 'string') {
      map.set(answer.field.id, {
        field: answer.field,
        content: {
          [answer.content]: 1,
          na: 0,
        },
      });
    } else if (Array.isArray(answer.content)) {
      const options = answer.content as string[];

      map.set(answer.field.id, {
        field: answer.field,
        content: {
          na: 0,
        },
      });

      options.forEach((option) => {
        const record = map.get(answer.field.id);

        if (!record) return;

        const content = record.content as SelectFormFieldReport;

        map.set(answer.field.id, {
          field: answer.field,
          content: {
            ...content,
            [option]: 1,
            na: 0,
          },
        });
      });
    } else {
      map.set(answer.field.id, {
        field: answer.field,
        content: {
          na: 1,
        },
      });
    }
  }
}
