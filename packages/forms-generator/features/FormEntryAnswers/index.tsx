import { useMemo, createElement } from 'react';
import { Stack, Divider } from '@mui/material';

import { FormEntry } from '@indocal/services';

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
  FilesAnswer,
  UsersAnswer,
  SectionAnswer,
  TableAnswer,
} from './components';

export interface FormEntryAnswersProps {
  entry: FormEntry;
}

export const FormEntryAnswers: React.FC<FormEntryAnswersProps> = ({
  entry,
}) => {
  const answers = useMemo(
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

      FILES: FilesAnswer,

      USERS: UsersAnswer,

      SECTION: SectionAnswer,
      TABLE: TableAnswer,
    }),
    []
  );

  return (
    <Stack divider={<Divider flexItem />} spacing={1}>
      {entry.answers.map((answer) =>
        createElement(answers[answer.field.type], {
          key: answer.field.id,
          answer,
        })
      )}
    </Stack>
  );
};

export default FormEntryAnswers;