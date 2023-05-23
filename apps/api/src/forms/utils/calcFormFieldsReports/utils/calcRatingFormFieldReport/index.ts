import { UUID } from '@/common';

import { FormFieldReport, RatingFormFieldReport } from '../../../../types';

import { FormEntryEntity } from '../../../../submodules/entries/entities';

export function calcRatingFormFieldReport(
  answer: FormEntryEntity['answers'][number],
  map: Map<UUID, FormFieldReport>
): void {
  const record = map.get(answer.field.id);

  if (record) {
    const content = record.content as RatingFormFieldReport;

    if (typeof answer.content === 'number') {
      const total = content.average * content.count + answer.content;

      map.set(answer.field.id, {
        field: answer.field,
        content: {
          count: content.count + 1,
          na: content.na,
          average: total / (content.count + 1),
        },
      });
    } else {
      map.set(answer.field.id, {
        field: answer.field,
        content: {
          count: content.count,
          na: content.na + 1,
          average: content.average,
        },
      });
    }
  } else {
    if (typeof answer.content === 'number') {
      map.set(answer.field.id, {
        field: answer.field,
        content: {
          count: 1,
          na: 0,
          average: answer.content,
        },
      });
    } else {
      map.set(answer.field.id, {
        field: answer.field,
        content: {
          count: 0,
          na: 1,
          average: 0,
        },
      });
    }
  }
}
