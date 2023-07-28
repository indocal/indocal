import { FormGeneratorAnswers } from '@indocal/forms-generator';
import { INDOCAL, FormFieldAnswer } from '@indocal/services';

import {
  serializeTextFormFieldAnswer,
  serializeTextAreaFormFieldAnswer,
  serializeNumberFormFieldAnswer,
  serializeDniFormFieldAnswer,
  serializePhoneFormFieldAnswer,
  serializeEmailFormFieldAnswer,
  serializeCheckboxFormFieldAnswer,
  serializeSelectFormFieldAnswer,
  serializeRadioFormFieldAnswer,
  serializeTimeFormFieldAnswer,
  serializeDateFormFieldAnswer,
  serializeDateTimeFormFieldAnswer,
  serializeRatingFormFieldAnswer,
  serializeNetPromoterScoreFormFieldAnswer,
  serializeSignatureFormFieldAnswer,
  serializeFilesFormFieldAnswer,
  serializeUsersFormFieldAnswer,
  serializeSectionFormFieldAnswer,
  serializeTableFormFieldAnswer,
} from './utils';

export async function serializeFormGeneratorAnswers(
  answers: FormGeneratorAnswers,
  client: INDOCAL
): Promise<FormFieldAnswer[]> {
  const serializers = {
    TEXT: serializeTextFormFieldAnswer,
    TEXTAREA: serializeTextAreaFormFieldAnswer,
    NUMBER: serializeNumberFormFieldAnswer,

    DNI: serializeDniFormFieldAnswer,
    PHONE: serializePhoneFormFieldAnswer,
    EMAIL: serializeEmailFormFieldAnswer,

    CHECKBOX: serializeCheckboxFormFieldAnswer,
    SELECT: serializeSelectFormFieldAnswer,
    RADIO: serializeRadioFormFieldAnswer,

    TIME: serializeTimeFormFieldAnswer,
    DATE: serializeDateFormFieldAnswer,
    DATETIME: serializeDateTimeFormFieldAnswer,

    RATING: serializeRatingFormFieldAnswer,
    NET_PROMOTER_SCORE: serializeNetPromoterScoreFormFieldAnswer,

    SIGNATURE: serializeSignatureFormFieldAnswer,

    FILES: serializeFilesFormFieldAnswer,

    USERS: serializeUsersFormFieldAnswer,

    SECTION: serializeSectionFormFieldAnswer,
    TABLE: serializeTableFormFieldAnswer,
  };

  const promises = answers.map((answer) =>
    serializers[answer.field.type](answer, client)
  );

  return await Promise.all(promises);
}

export default serializeFormGeneratorAnswers;
