import { UUID } from '@/common';

import { FormFieldReport, RatingFormFieldReport } from '../../types';

import { FormEntryEntity } from '../../submodules/entries/entities';

export function calcRatingFormFieldReport(
  answer: FormEntryEntity['answers'][number],
  map: Map<UUID, FormFieldReport>
): void {
  const record = map.get(answer.field.id);

  let total = 0;

  if (record) {
    const content = record.content as RatingFormFieldReport;

    if (typeof answer.content === 'number') {
      total += answer.content;

      if (answer.content) {
        map.set(answer.field.id, {
          field: answer.field,
          content: {
            count: content.count + 1,
            na: content.na,
            average: total / (content.count + 1),
          },
        });
      }
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
      total += answer.content;

      map.set(answer.field.id, {
        field: answer.field,
        content: {
          count: 1,
          na: 0,
          average: total,
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
