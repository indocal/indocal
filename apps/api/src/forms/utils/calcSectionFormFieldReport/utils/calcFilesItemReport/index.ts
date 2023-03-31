import { UUID } from '@/common';

import {
  SectionFormFieldItemReport,
  FilesFormFieldReport,
} from '../../../../types';

import { SectionFormFieldItemAnswer } from '../../../../submodules/entries/entities';

export function calcFilesItemReport(
  answer: SectionFormFieldItemAnswer,
  map: Map<string, SectionFormFieldItemReport>
): void {
  const record = map.get(answer.item.id);

  if (record) {
    const content = record.content as FilesFormFieldReport;

    if (typeof answer.content === 'string') {
      map.set(answer.item.id, {
        item: answer.item,
        content: {
          count: content.count + 1,
          na: content.na,
          lastAnswers: [answer.content].concat(content.lastAnswers.slice(0, 2)),
        },
      });
    } else if (Array.isArray(answer.content)) {
      const files = answer.content as UUID[];

      files.forEach((file) => {
        const record = map.get(answer.item.id);

        if (!record) return;

        const content = record.content as FilesFormFieldReport;

        map.set(answer.item.id, {
          item: answer.item,
          content: {
            count: content.count + 1,
            na: content.na,
            lastAnswers: [file].concat(content.lastAnswers.slice(0, 2)),
          },
        });
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
    if (typeof answer.content === 'string') {
      map.set(answer.item.id, {
        item: answer.item,
        content: {
          count: 1,
          na: 0,
          lastAnswers: [answer.content],
        },
      });
    } else if (Array.isArray(answer.content)) {
      const files = answer.content as UUID[];

      map.set(answer.item.id, {
        item: answer.item,
        content: {
          count: 0,
          na: 0,
          lastAnswers: [],
        },
      });

      files.forEach((file) => {
        const record = map.get(answer.item.id);

        if (!record) return;

        const content = record.content as FilesFormFieldReport;

        map.set(answer.item.id, {
          item: answer.item,
          content: {
            count: content.count + 1,
            na: content.na,
            lastAnswers: [file].concat(content.lastAnswers.slice(0, 2)),
          },
        });
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
