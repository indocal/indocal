import { UUID } from '@/common';

import { FormFieldReport } from '../../types';

import {
  FormEntryEntity,
  FormFieldAnswer,
} from '../../submodules/entries/entities';

import {
  calcTextFormFieldReport,
  calcTextAreaFormFieldReport,
  calcNumberFormFieldReport,
  calcDniFormFieldReport,
  calcPhoneFormFieldReport,
  calcEmailFormFieldReport,
  calcCheckboxFormFieldReport,
  calcSelectFormFieldReport,
  calcRadioFormFieldReport,
  calcTimeFormFieldReport,
  calcDateFormFieldReport,
  calcDateTimeFormFieldReport,
  calcRatingFormFieldReport,
  calcNetPromoterScoreFormFieldReport,
  calcSignatureFormFieldReport,
  calcUsersFormFieldReport,
  calcFilesFormFieldReport,
  calcSectionFormFieldReport,
  calcTableFormFieldReport,
} from './utils';

export function calcFormFieldsReports(records: FormEntryEntity[]) {
  const map: Map<UUID, FormFieldReport> = new Map();

  const helpers: Record<
    FormFieldAnswer['field']['type'],
    (answer: FormFieldAnswer, map: Map<string, FormFieldReport>) => void
  > = {
    TEXT: calcTextFormFieldReport,
    TEXTAREA: calcTextAreaFormFieldReport,
    NUMBER: calcNumberFormFieldReport,

    DNI: calcDniFormFieldReport,
    PHONE: calcPhoneFormFieldReport,
    EMAIL: calcEmailFormFieldReport,

    CHECKBOX: calcCheckboxFormFieldReport,
    SELECT: calcSelectFormFieldReport,
    RADIO: calcRadioFormFieldReport,

    TIME: calcTimeFormFieldReport,
    DATE: calcDateFormFieldReport,
    DATETIME: calcDateTimeFormFieldReport,

    RATING: calcRatingFormFieldReport,
    NET_PROMOTER_SCORE: calcNetPromoterScoreFormFieldReport,

    SIGNATURE: calcSignatureFormFieldReport,

    FILES: calcFilesFormFieldReport,

    USERS: calcUsersFormFieldReport,

    SECTION: calcSectionFormFieldReport,
    TABLE: calcTableFormFieldReport,
  };

  records.forEach((record) => {
    record.answers.forEach((answer) => {
      helpers[answer.field.type](answer, map);
    });
  });

  return Array.from(map.values());
}

export default calcFormFieldsReports;
