import { Fragment, useMemo } from 'react';
import { Paper, Stack, Divider } from '@mui/material';

import { FormEntry } from '@indocal/services';

import { FormFieldAnswer } from '@/features';

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

      USERS: UsersFormFieldAnswer,

      TABLE: TableFormFieldAnswer,
    }),
    []
  );

  // TODO: remove as unknown as
  return (
    <Stack
      component={Paper}
      spacing={1}
      divider={<Divider flexItem />}
      sx={{ padding: (theme) => theme.spacing(2) }}
    >
      {entry.answers.map((answer) => (
        <Fragment key={(answer as unknown as FormFieldAnswer).field.id}>
          {answers[(answer as unknown as FormFieldAnswer).field.type]({
            answer: answer as unknown as FormFieldAnswer,
          })}
        </Fragment>
      ))}
    </Stack>
  );
};

export default FormEntryAnswers;
