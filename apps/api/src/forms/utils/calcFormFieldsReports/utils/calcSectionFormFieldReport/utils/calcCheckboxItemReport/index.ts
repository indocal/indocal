import {
  SectionFormFieldItemReport,
  CheckboxFormFieldReport,
} from '../../../../../../types';

import { SectionFormFieldItemAnswer } from '../../../../../../submodules/entries/entities';

export function calcCheckboxItemReport(
  answer: SectionFormFieldItemAnswer,
  map: Map<string, SectionFormFieldItemReport>
): void {
  const record = map.get(answer.item.id);

  if (record) {
    const content = record.content as CheckboxFormFieldReport;

    if (typeof answer.content === 'boolean') {
      if (answer.content) {
        map.set(answer.item.id, {
          item: answer.item,
          content: {
            yes: content.yes + 1,
            no: content.no,
            na: content.na,
          },
        });
      } else {
        map.set(answer.item.id, {
          item: answer.item,
          content: {
            yes: content.yes,
            no: content.no + 1,
            na: content.na,
          },
        });
      }
    } else {
      map.set(answer.item.id, {
        item: answer.item,
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
        map.set(answer.item.id, {
          item: answer.item,
          content: {
            yes: 1,
            no: 0,
            na: 0,
          },
        });
      } else {
        map.set(answer.item.id, {
          item: answer.item,
          content: {
            yes: 0,
            no: 1,
            na: 0,
          },
        });
      }
    } else {
      map.set(answer.item.id, {
        item: answer.item,
        content: {
          yes: 0,
          no: 0,
          na: 1,
        },
      });
    }
  }
}
