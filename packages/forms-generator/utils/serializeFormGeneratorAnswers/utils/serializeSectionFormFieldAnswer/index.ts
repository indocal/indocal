import { FormGeneratorAnswers } from '@indocal/forms-generator';
import {
  INDOCAL,
  FormFieldAnswer,
  SectionFormFieldAnswer,
} from '@indocal/services';

import {
  serializeTextItemAnswer,
  serializeTextAreaItemAnswer,
  serializeNumberItemAnswer,
  serializeDniItemAnswer,
  serializePhoneItemAnswer,
  serializeEmailItemAnswer,
  serializeCheckboxItemAnswer,
  serializeSelectItemAnswer,
  serializeRadioItemAnswer,
  serializeTimeItemAnswer,
  serializeDateItemAnswer,
  serializeDateTimeItemAnswer,
  serializeRatingItemAnswer,
  serializeNetPromoterScoreItemAnswer,
  serializeFilesItemAnswer,
  serializeUsersItemAnswer,
} from './utils';

export async function serializeSectionFormFieldAnswer(
  answer: FormGeneratorAnswers[number],
  client: INDOCAL
): Promise<FormFieldAnswer> {
  const items = answer.content as SectionFormFieldAnswer | null;

  const serializers = {
    TEXT: serializeTextItemAnswer,
    TEXTAREA: serializeTextAreaItemAnswer,
    NUMBER: serializeNumberItemAnswer,

    DNI: serializeDniItemAnswer,
    PHONE: serializePhoneItemAnswer,
    EMAIL: serializeEmailItemAnswer,

    CHECKBOX: serializeCheckboxItemAnswer,
    SELECT: serializeSelectItemAnswer,
    RADIO: serializeRadioItemAnswer,

    TIME: serializeTimeItemAnswer,
    DATE: serializeDateItemAnswer,
    DATETIME: serializeDateTimeItemAnswer,

    RATING: serializeRatingItemAnswer,
    NET_PROMOTER_SCORE: serializeNetPromoterScoreItemAnswer,

    FILES: serializeFilesItemAnswer,

    USERS: serializeUsersItemAnswer,
  };

  if (items) {
    const promises = items.map(({ item, content }) =>
      serializers[item.type]({ item, content }, client)
    );

    const data = await Promise.all(promises);

    return {
      field: answer.field,
      content: data,
    };
  }

  return {
    field: answer.field,
    content: null,
  };
}

export default serializeSectionFormFieldAnswer;
