import { UUID } from '@/common';

import {
  FormFieldReport,
  NetPromoterScoreFormFieldReport,
} from '../../../../types';

import { FormEntryEntity } from '../../../../submodules/entries/entities';

export function calcNetPromoterScoreFormFieldReport(
  answer: FormEntryEntity['answers'][number],
  map: Map<UUID, FormFieldReport>
): void {
  const record = map.get(answer.field.id);

  if (record) {
    const content = record.content as NetPromoterScoreFormFieldReport;

    if (typeof answer.content === 'number') {
      if (answer.content >= 0 && answer.content <= 3) {
        map.set(answer.field.id, {
          field: answer.field,
          content: {
            positive: content.positive,
            neutral: content.neutral,
            negative: content.negative + 1,
            na: content.na,
          },
        });
      }

      if (answer.content >= 4 && answer.content <= 6) {
        map.set(answer.field.id, {
          field: answer.field,
          content: {
            positive: content.positive,
            neutral: content.neutral + 1,
            negative: content.negative,
            na: content.na,
          },
        });
      }

      if (answer.content >= 7 && answer.content <= 10) {
        map.set(answer.field.id, {
          field: answer.field,
          content: {
            positive: content.positive + 1,
            neutral: content.neutral,
            negative: content.negative,
            na: content.na,
          },
        });
      }
    } else {
      map.set(answer.field.id, {
        field: answer.field,
        content: {
          positive: content.positive,
          neutral: content.neutral,
          negative: content.negative,
          na: content.na + 1,
        },
      });
    }
  } else {
    if (typeof answer.content === 'number') {
      if (answer.content >= 0 && answer.content <= 3) {
        map.set(answer.field.id, {
          field: answer.field,
          content: {
            positive: 0,
            neutral: 0,
            negative: 1,
            na: 0,
          },
        });
      }

      if (answer.content >= 4 && answer.content <= 6) {
        map.set(answer.field.id, {
          field: answer.field,
          content: {
            positive: 0,
            neutral: 1,
            negative: 0,
            na: 0,
          },
        });
      }

      if (answer.content >= 7 && answer.content <= 10) {
        map.set(answer.field.id, {
          field: answer.field,
          content: {
            positive: 1,
            neutral: 0,
            negative: 0,
            na: 0,
          },
        });
      }
    } else {
      map.set(answer.field.id, {
        field: answer.field,
        content: {
          positive: 0,
          neutral: 0,
          negative: 0,
          na: 1,
        },
      });
    }
  }
}
