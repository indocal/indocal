import {
  SectionFormFieldItemReport,
  RadioFormFieldReport,
} from '../../../../../../types';

import { SectionFormFieldItemAnswer } from '../../../../../../submodules/entries/entities';

export function calcRadioItemReport(
  answer: SectionFormFieldItemAnswer,
  map: Map<string, SectionFormFieldItemReport>
): void {
  const record = map.get(answer.item.id);

  if (record) {
    const content = record.content as RadioFormFieldReport;

    if (typeof answer.content === 'string') {
      map.set(answer.item.id, {
        item: answer.item,
        content: {
          ...content,
          na: content.na,
          [answer.content]: content[answer.content]
            ? content[answer.content] + 1
            : 1,
        },
      });
    } else {
      map.set(answer.item.id, {
        item: answer.item,
        content: {
          ...content,
          na: content.na + 1,
        },
      });
    }
  } else {
    if (typeof answer.content === 'string') {
      map.set(answer.item.id, {
        item: answer.item,
        content: {
          [answer.content]: 1,
          na: 0,
        },
      });
    } else {
      map.set(answer.item.id, {
        item: answer.item,
        content: {
          na: 1,
        },
      });
    }
  }
}
