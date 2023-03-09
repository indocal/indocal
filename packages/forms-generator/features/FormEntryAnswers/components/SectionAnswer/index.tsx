import { useMemo, createElement } from 'react';
import { Paper, Stack, Divider, Typography, Chip } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  translateFormFieldType,
  FormFieldAnswer,
  SectionFormFieldAnswer,
} from '@indocal/services';

import {
  TextItemAnswer,
  TextAreaItemAnswer,
  NumberItemAnswer,
  DniItemAnswer,
  PhoneItemAnswer,
  EmailItemAnswer,
  CheckboxItemAnswer,
  SelectItemAnswer,
  RadioItemAnswer,
  TimeItemAnswer,
  DateItemAnswer,
  DateTimeItemAnswer,
  FilesItemAnswer,
  UsersItemAnswer,
} from './components';

export interface SectionAnswerProps {
  answer: FormFieldAnswer;
}

export const SectionAnswer: React.FC<SectionAnswerProps> = ({ answer }) => {
  const content = useMemo(
    () => answer.content as SectionFormFieldAnswer | null,
    [answer]
  );

  const answers = useMemo(
    () => ({
      TEXT: TextItemAnswer,
      TEXTAREA: TextAreaItemAnswer,
      NUMBER: NumberItemAnswer,

      DNI: DniItemAnswer,
      PHONE: PhoneItemAnswer,
      EMAIL: EmailItemAnswer,

      CHECKBOX: CheckboxItemAnswer,
      SELECT: SelectItemAnswer,
      RADIO: RadioItemAnswer,

      TIME: TimeItemAnswer,
      DATE: DateItemAnswer,
      DATETIME: DateTimeItemAnswer,

      FILES: FilesItemAnswer,

      USERS: UsersItemAnswer,
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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={1}
      >
        <Stack>
          <Typography variant="h6">{answer.field.title}</Typography>

          {answer.field.description && (
            <Typography
              component="pre"
              variant="caption"
              color="text.secondary"
            >
              {answer.field.description}
            </Typography>
          )}
        </Stack>

        <Chip label={translateFormFieldType(answer.field.type)} />
      </Stack>

      {content && content.length > 0 ? (
        <Stack divider={<Divider flexItem />} spacing={1}>
          {content.map((answer) =>
            createElement(answers[answer.item.type], {
              key: answer.item.title,
              answer,
            })
          )}
        </Stack>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Stack>
  );
};

export default SectionAnswer;
