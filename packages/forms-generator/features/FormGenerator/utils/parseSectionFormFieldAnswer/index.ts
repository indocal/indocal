import {
  SectionFormFieldConfig,
  SectionFormFieldAnswer,
} from '@indocal/services';

import { FormGeneratorFormFieldAnswer } from '../../types';

import {
  parseTextItemAnswer,
  parseTextAreaItemAnswer,
  parseNumberItemAnswer,
  parseDniItemAnswer,
  parsePhoneItemAnswer,
  parseEmailItemAnswer,
  parseCheckboxItemAnswer,
  parseSelectItemAnswer,
  parseRadioItemAnswer,
  parseTimeItemAnswer,
  parseDateItemAnswer,
  parseDateTimeItemAnswer,
  parseRatingItemAnswer,
  parseNetPromoterScoreItemAnswer,
  parseFilesItemAnswer,
  parseUsersItemAnswer,
} from './utils';

export type SectionFormFieldFormData = Record<
  string,
  | Parameters<typeof parseTextItemAnswer>[number]['content']
  | Parameters<typeof parseTextAreaItemAnswer>[number]['content']
  | Parameters<typeof parseNumberItemAnswer>[number]['content']
  | Parameters<typeof parseDniItemAnswer>[number]['content']
  | Parameters<typeof parsePhoneItemAnswer>[number]['content']
  | Parameters<typeof parseEmailItemAnswer>[number]['content']
  | Parameters<typeof parseCheckboxItemAnswer>[number]['content']
  | Parameters<typeof parseSelectItemAnswer>[number]['content']
  | Parameters<typeof parseRadioItemAnswer>[number]['content']
  | Parameters<typeof parseTimeItemAnswer>[number]['content']
  | Parameters<typeof parseDateItemAnswer>[number]['content']
  | Parameters<typeof parseDateTimeItemAnswer>[number]['content']
  | Parameters<typeof parseRatingItemAnswer>[number]['content']
  | Parameters<typeof parseNetPromoterScoreItemAnswer>[number]['content']
  | Parameters<typeof parseFilesItemAnswer>[number]['content']
  | Parameters<typeof parseUsersItemAnswer>[number]['content']
>;

export function parseSectionFormFieldAnswer(
  answer: FormGeneratorFormFieldAnswer<SectionFormFieldFormData | null>
): FormGeneratorFormFieldAnswer<SectionFormFieldAnswer | null> {
  const config = answer.field.config as SectionFormFieldConfig | null;
  const items = answer.content;

  const parsers = {
    TEXT: parseTextItemAnswer,
    TEXTAREA: parseTextAreaItemAnswer,
    NUMBER: parseNumberItemAnswer,

    DNI: parseDniItemAnswer,
    PHONE: parsePhoneItemAnswer,
    EMAIL: parseEmailItemAnswer,

    CHECKBOX: parseCheckboxItemAnswer,
    SELECT: parseSelectItemAnswer,
    RADIO: parseRadioItemAnswer,

    TIME: parseTimeItemAnswer,
    DATE: parseDateItemAnswer,
    DATETIME: parseDateTimeItemAnswer,

    RATING: parseRatingItemAnswer,
    NET_PROMOTER_SCORE: parseNetPromoterScoreItemAnswer,

    FILES: parseFilesItemAnswer,

    USERS: parseUsersItemAnswer,
  };

  return {
    field: answer.field,
    content:
      items && config && config.items && config.items.length > 0
        ? (config.items.map((item) =>
            parsers[item.type]({
              item,
              content: items[item.id] as null,
            })
          ) as SectionFormFieldAnswer)
        : null,
  };
}

export default parseSectionFormFieldAnswer;
