import { useMemo, createElement } from 'react';
import { Paper, Stack, Divider } from '@mui/material';

import { FormEntry } from '@indocal/services';

import {
  TextFormFieldAnswer,
  TextAreaFormFieldAnswer,
  NumberFormFieldAnswer,
  DniFormFieldAnswer,
  PhoneFormFieldAnswer,
  EmailFormFieldAnswer,
  CheckboxFormFieldAnswer,
  SelectFormFieldAnswer,
  RadioFormFieldAnswer,
  TimeFormFieldAnswer,
  DateFormFieldAnswer,
  DateTimeFormFieldAnswer,
  UsersFormFieldAnswer,
  SectionFormFieldAnswer,
  TableFormFieldAnswer,
} from './components';

export interface FormEntryAnswersProps {
  entry: FormEntry;
}

export const FormEntryAnswers: React.FC<FormEntryAnswersProps> = ({
  entry,
}) => {
  const answers = useMemo(
    () => ({
      TEXT: TextFormFieldAnswer,
      TEXTAREA: TextAreaFormFieldAnswer,
      NUMBER: NumberFormFieldAnswer,

      DNI: DniFormFieldAnswer,
      PHONE: PhoneFormFieldAnswer,
      EMAIL: EmailFormFieldAnswer,

      CHECKBOX: CheckboxFormFieldAnswer,
      SELECT: SelectFormFieldAnswer,
      RADIO: RadioFormFieldAnswer,

      TIME: TimeFormFieldAnswer,
      DATE: DateFormFieldAnswer,
      DATETIME: DateTimeFormFieldAnswer,

      FILES: UsersFormFieldAnswer,

      USERS: UsersFormFieldAnswer,

      SECTION: SectionFormFieldAnswer,
      TABLE: TableFormFieldAnswer,
    }),
    []
  );

  return (
    <Stack
      component={Paper}
      spacing={1}
      divider={<Divider flexItem />}
      sx={{ padding: (theme) => theme.spacing(2) }}
    >
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
