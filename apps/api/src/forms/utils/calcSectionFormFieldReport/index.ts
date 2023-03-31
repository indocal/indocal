import { UUID } from '@/common';

import { FormFieldReport, SectionFormFieldItemReport } from '../../types';

import {
  FormEntryEntity,
  SectionFormFieldAnswer,
  SectionFormFieldItemAnswer,
} from '../../submodules/entries/entities';
import { SectionFormFieldConfig } from '../../submodules/fields/entities';

import {
  calcTextItemReport,
  calcTextAreaItemReport,
  calcNumberItemReport,
  calcDniItemReport,
  calcPhoneItemReport,
  calcEmailItemReport,
  calcCheckboxItemReport,
  calcSelectItemReport,
  calcRadioItemReport,
  calcTimeItemReport,
  calcDateItemReport,
  calcDateTimeItemReport,
  calcRatingItemReport,
  calcNetPromoterScoreItemReport,
  calcUsersItemReport,
  calcFilesItemReport,
} from './utils';

export function calcSectionFormFieldReport(
  answer: FormEntryEntity['answers'][number],
  map: Map<UUID, FormFieldReport>
): void {
  const helpers: Record<
    SectionFormFieldAnswer[number]['item']['type'],
    (
      answer: SectionFormFieldItemAnswer,
      map: Map<string, SectionFormFieldItemReport>
    ) => void
  > = {
    TEXT: calcTextItemReport,
    TEXTAREA: calcTextAreaItemReport,
    NUMBER: calcNumberItemReport,

    DNI: calcDniItemReport,
    PHONE: calcPhoneItemReport,
    EMAIL: calcEmailItemReport,

    CHECKBOX: calcCheckboxItemReport,
    SELECT: calcSelectItemReport,
    RADIO: calcRadioItemReport,

    TIME: calcTimeItemReport,
    DATE: calcDateItemReport,
    DATETIME: calcDateTimeItemReport,

    RATING: calcRatingItemReport,
    NET_PROMOTER_SCORE: calcNetPromoterScoreItemReport,

    FILES: calcUsersItemReport,

    USERS: calcFilesItemReport,
  };

  const config = answer.field.config as SectionFormFieldConfig | null;

  if (!config || config.items.length === 0) return;

  const record = map.get(answer.field.id);

  if (record) {
    const content = answer.content as SectionFormFieldAnswer | null;

    if (content) {
      const acc = record.content as SectionFormFieldItemReport[];

      const items = new Map<string, SectionFormFieldItemReport>(
        acc.map((item) => [item.item.id, item])
      );

      content.forEach(({ item, content }) => {
        helpers[item.type]({ item, content }, items);
      });

      map.set(answer.field.id, {
        field: answer.field,
        content: Array.from(items.values()),
      });
    }
  } else {
    const content = answer.content as SectionFormFieldAnswer | null;

    if (content) {
      const items = new Map<string, SectionFormFieldItemReport>();

      content.forEach(({ item, content }) => {
        helpers[item.type]({ item, content }, items);
      });

      map.set(answer.field.id, {
        field: answer.field,
        content: Array.from(items.values()),
      });
    } else {
      map.set(answer.field.id, {
        field: answer.field,
        content: [],
      });
    }
  }
}
