import { useMemo, createElement } from 'react';
import { Stack, Divider } from '@mui/material';

import { FormFieldAnswer } from '@indocal/services';

import {
  TextAnswer,
  TextAreaAnswer,
  NumberAnswer,
  DniAnswer,
  PhoneAnswer,
  EmailAnswer,
  CheckboxAnswer,
  SelectAnswer,
  RadioAnswer,
  TimeAnswer,
  DateAnswer,
  DateTimeAnswer,
  RatingAnswer,
  NetPromoterScoreAnswer,
  SignatureAnswer,
  FilesAnswer,
  UsersAnswer,
  SectionAnswer,
  TableAnswer,
} from './components';

export interface FormEntryAnswersProps {
  answers: FormFieldAnswer[];
}

export const FormEntryAnswers: React.FC<FormEntryAnswersProps> = ({
  answers,
}) => {
  const components = useMemo(
    () => ({
      TEXT: TextAnswer,
      TEXTAREA: TextAreaAnswer,
      NUMBER: NumberAnswer,

      DNI: DniAnswer,
      PHONE: PhoneAnswer,
      EMAIL: EmailAnswer,

      CHECKBOX: CheckboxAnswer,
      SELECT: SelectAnswer,
      RADIO: RadioAnswer,

      TIME: TimeAnswer,
      DATE: DateAnswer,
      DATETIME: DateTimeAnswer,

      RATING: RatingAnswer,
      NET_PROMOTER_SCORE: NetPromoterScoreAnswer,

      SIGNATURE: SignatureAnswer,

      FILES: FilesAnswer,

      USERS: UsersAnswer,

      SECTION: SectionAnswer,
      TABLE: TableAnswer,
    }),
    []
  );

  return (
    <Stack spacing={1} divider={<Divider flexItem />}>
      {answers.map((answer) =>
        createElement(components[answer.field.type], {
          key: answer.field.id,
          answer,
        })
      )}
    </Stack>
  );
};

export default FormEntryAnswers;
