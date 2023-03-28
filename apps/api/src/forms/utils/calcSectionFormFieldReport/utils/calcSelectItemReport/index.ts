import {
  SectionFormFieldItemReport,
  SelectFormFieldReport,
} from '../../../../types';

import { SectionFormFieldItemAnswer } from '../../../../submodules/entries/entities';

export function calcSelectItemReport(
  answer: SectionFormFieldItemAnswer,
  map: Map<string, SectionFormFieldItemReport>
): void {
  const record = map.get(answer.item.title);

  if (record) {
    const content = record.content as SelectFormFieldReport;

    if (typeof answer.content === 'string') {
      map.set(answer.item.title, {
        item: answer.item,
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

      const record = map.get(answer.item.title);

      if (!record) return;

      const content = record.content as SelectFormFieldReport;

      options.forEach((option) => {
        map.set(answer.item.title, {
          item: answer.item,
          content: {
            ...content,
            na: content.na,
            [option]: content[option] ? content[option] + 1 : 1,
          },
        });
      });
    } else {
      map.set(answer.item.title, {
        item: answer.item,
        content: {
          ...content,
          na: content.na + 1,
        },
      });
    }
  } else {
    if (typeof answer.content === 'string') {
      map.set(answer.item.title, {
        item: answer.item,
        content: {
          [answer.content]: 1,
          na: 0,
        },
      });
    } else if (Array.isArray(answer.content)) {
      const options = answer.content as string[];

      map.set(answer.item.title, {
        item: answer.item,
        content: {
          na: 0,
        },
      });

      options.forEach((option) => {
        const record = map.get(answer.item.title);

        if (!record) return;

        const content = record.content as SelectFormFieldReport;

        map.set(answer.item.title, {
          item: answer.item,
          content: {
            ...content,
            [option]: 1,
            na: 0,
          },
        });
      });
    } else {
      map.set(answer.item.title, {
        item: answer.item,
        content: {
          na: 1,
        },
      });
    }
  }
}
