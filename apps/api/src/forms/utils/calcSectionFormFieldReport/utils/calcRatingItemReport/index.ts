import {
  SectionFormFieldItemReport,
  RatingFormFieldReport,
} from '../../../../types';

import { SectionFormFieldItemAnswer } from '../../../../submodules/entries/entities';

export function calcRatingItemReport(
  answer: SectionFormFieldItemAnswer,
  map: Map<string, SectionFormFieldItemReport>
): void {
  const record = map.get(answer.item.id);

  if (record) {
    const content = record.content as RatingFormFieldReport;

    if (typeof answer.content === 'number') {
      const total = content.average * content.count + answer.content;

      map.set(answer.item.id, {
        item: answer.item,
        content: {
          count: content.count + 1,
          na: content.na,
          average: total / (content.count + 1),
        },
      });
    } else {
      map.set(answer.item.id, {
        item: answer.item,
        content: {
          count: content.count,
          na: content.na + 1,
          average: content.average,
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
          average: answer.content,
        },
      });
    } else {
      map.set(answer.item.id, {
        item: answer.item,
        content: {
          count: 0,
          na: 1,
          average: 0,
        },
      });
    }
  }
}
