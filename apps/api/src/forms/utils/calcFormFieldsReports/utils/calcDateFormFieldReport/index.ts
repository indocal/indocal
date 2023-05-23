import { UUID } from '@/common';

import { FormFieldReport, DateFormFieldReport } from '../../../../types';

import { FormEntryEntity } from '../../../../submodules/entries/entities';

export function calcDateFormFieldReport(
  answer: FormEntryEntity['answers'][number],
  map: Map<UUID, FormFieldReport>
): void {
  const record = map.get(answer.field.id);

  if (record) {
    const content = record.content as DateFormFieldReport;

    if (typeof answer.content === 'string') {
      map.set(answer.field.id, {
        field: answer.field,
        content: {
          count: content.count + 1,
          na: content.na,
          lastAnswers: [answer.content].concat(content.lastAnswers.slice(0, 2)),
        },
      });
    } else {
      map.set(answer.field.id, {
        field: answer.field,
        content: {
          count: content.count,
          na: content.na + 1,
          lastAnswers: content.lastAnswers,
        },
      });
    }
  } else {
    if (typeof answer.content === 'string') {
      map.set(answer.field.id, {
        field: answer.field,
        content: {
          count: 1,
          na: 0,
          lastAnswers: [answer.content],
        },
      });
    } else {
      map.set(answer.field.id, {
        field: answer.field,
        content: {
          count: 0,
          na: 1,
          lastAnswers: [],
        },
      });
    }
  }
}
