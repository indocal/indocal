import { UUID } from '@/common';

import { FormFieldReport, RadioFormFieldReport } from '../../types';

import { FormEntryEntity } from '../../submodules/entries/entities';

export function calcRadioFormFieldReport(
  answer: FormEntryEntity['answers'][number],
  map: Map<UUID, FormFieldReport>
): void {
  const record = map.get(answer.field.id);

  if (record) {
    const content = record.content as RadioFormFieldReport;

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
