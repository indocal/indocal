import {
  SectionFormFieldItemReport,
  NumberFormFieldReport,
} from '../../../../types';

import { SectionFormFieldItemAnswer } from '../../../../submodules/entries/entities';

export function calcNumberItemReport(
  answer: SectionFormFieldItemAnswer,
  map: Map<string, SectionFormFieldItemReport>
): void {
  const record = map.get(answer.item.id);

  if (record) {
    const content = record.content as NumberFormFieldReport;

    if (typeof answer.content === 'number') {
      map.set(answer.item.id, {
        item: answer.item,
        content: {
          count: content.count + 1,
          na: content.na,
          lastAnswers: [answer.content].concat(content.lastAnswers.slice(0, 2)),
        },
      });
    } else {
      map.set(answer.item.id, {
        item: answer.item,
        content: {
          count: content.count,
          na: content.na + 1,
          lastAnswers: content.lastAnswers,
        },
      });
    }
  } else {
    if (typeof answer.content === 'number') {
      map.set(answer.item.id, {
        item: answer.item,
        content: {
          count: 1,
          na: 0,
          lastAnswers: [answer.content],
        },
      });
    } else {
      map.set(answer.item.id, {
        item: answer.item,
        content: {
          count: 0,
          na: 1,
          lastAnswers: [],
        },
      });
    }
  }
}
