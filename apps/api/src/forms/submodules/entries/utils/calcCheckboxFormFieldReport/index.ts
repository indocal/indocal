import { UUID } from '@/common';

import { FormEntryEntity } from '../../entities';
import { FormFieldReport, CheckboxFormFieldReport } from '../../types';

export function calcCheckboxFormFieldReport(
  answer: FormEntryEntity['answers'][number],
  map: Map<UUID, FormFieldReport>
): void {
  const record = map.get(answer.field.id);

  if (record) {
    const content = record.content as CheckboxFormFieldReport;

    if (typeof answer.content === 'boolean') {
      if (answer.content) {
        map.set(answer.field.id, {
          field: answer.field,
          content: {
            yes: content.yes + 1,
            no: content.no,
            na: content.na,
          },
        });
      } else {
        map.set(answer.field.id, {
          field: answer.field,
          content: {
            yes: content.yes,
            no: content.no + 1,
            na: content.na,
          },
        });
      }
    } else {
      map.set(answer.field.id, {
        field: answer.field,
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
        map.set(answer.field.id, {
          field: answer.field,
          content: {
            yes: 1,
            no: 0,
            na: 0,
          },
        });
      } else {
        map.set(answer.field.id, {
          field: answer.field,
          content: {
            yes: 0,
            no: 1,
            na: 0,
          },
        });
      }
    } else {
      map.set(answer.field.id, {
        field: answer.field,
        content: {
          yes: 0,
          no: 0,
          na: 1,
        },
      });
    }
  }
}
