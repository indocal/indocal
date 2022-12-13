import { Form, SectionFormFieldConfig } from '@indocal/services';

import { FormFieldAnswer, SectionFormFieldAnswer } from '../../types';

import parseTextFormFieldAnswer from '../parseTextFormFieldAnswer';
import parseTextAreaFormFieldAnswer from '../parseTextAreaFormFieldAnswer';
import parseNumberFormFieldAnswer from '../parseNumberFormFieldAnswer';
import parseDniFormFieldAnswer from '../parseDniFormFieldAnswer';
import parsePhoneFormFieldAnswer from '../parsePhoneFormFieldAnswer';
import parseEmailFormFieldAnswer from '../parseEmailFormFieldAnswer';
import parseCheckboxFormFieldAnswer from '../parseCheckboxFormFieldAnswer';
import parseSelectFormFieldAnswer from '../parseSelectFormFieldAnswer';
import parseRadioFormFieldAnswer from '../parseRadioFormFieldAnswer';
import parseTimeFormFieldAnswer from '../parseTimeFormFieldAnswer';
import parseDateFormFieldAnswer from '../parseDateFormFieldAnswer';
import parseDateTimeFormFieldAnswer from '../parseDateTimeFormFieldAnswer';
import parseUsersFormFieldAnswer from '../parseUsersFormFieldAnswer';

export function parseSectionFormFieldAnswer(
  field: Form['fields'][number],
  answer: FormFieldAnswer['content']
): FormFieldAnswer {
  const config = field.config as SectionFormFieldConfig | null;
  const items = answer as SectionFormFieldAnswer | null;

  const parsers = {
    TEXT: parseTextFormFieldAnswer,
    TEXTAREA: parseTextAreaFormFieldAnswer,
    NUMBER: parseNumberFormFieldAnswer,

    DNI: parseDniFormFieldAnswer,
    PHONE: parsePhoneFormFieldAnswer,
    EMAIL: parseEmailFormFieldAnswer,

    CHECKBOX: parseCheckboxFormFieldAnswer,
    SELECT: parseSelectFormFieldAnswer,
    RADIO: parseRadioFormFieldAnswer,

    TIME: parseTimeFormFieldAnswer,
    DATE: parseDateFormFieldAnswer,
    DATETIME: parseDateTimeFormFieldAnswer,

    USERS: parseUsersFormFieldAnswer,
  };

  return {
    field,
    content:
      items && config && config.items.length > 0
        ? config.items.reduce<SectionFormFieldAnswer>((prev, item) => {
            const { content } = parsers[item.type](field, items[item.title]);

            return {
              ...prev,
              [item.title]: content as SectionFormFieldAnswer[string],
            };
          }, {})
        : null,
  };
}

export default parseSectionFormFieldAnswer;
