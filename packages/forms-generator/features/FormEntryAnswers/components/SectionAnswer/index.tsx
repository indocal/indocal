import { useState, useMemo, createElement } from 'react';
import {
  Paper,
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
} from '@mui/material';
import { ExpandMore as ViewOptionsIcon } from '@mui/icons-material';

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
  RatingItemAnswer,
  NetPromoterScoreItemAnswer,
  FilesItemAnswer,
  UsersItemAnswer,
} from './components';

export interface SectionAnswerProps {
  answer: FormFieldAnswer;
}

export const SectionAnswer: React.FC<SectionAnswerProps> = ({ answer }) => {
  const [expand, setExpand] = useState(false);

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

      RATING: RatingItemAnswer,
      NET_PROMOTER_SCORE: NetPromoterScoreItemAnswer,

      FILES: FilesItemAnswer,

      USERS: UsersItemAnswer,
    }),
    []
  );

  return (
    <Paper
      component={Accordion}
      disableGutters
      expanded={expand}
      onChange={() => setExpand(!expand)}
      sx={{ '&:before': { display: 'none' } }}
    >
      <AccordionSummary>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{ width: '100%' }}
        >
          <Stack>
            <Typography variant="h6">{answer.field.title}</Typography>

            {answer.field.description && (
              <Typography
                component="pre"
                variant="caption"
                color="text.secondary"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {answer.field.description}
              </Typography>
            )}
          </Stack>

          <Stack alignSelf="flex-start" alignItems="center" spacing={1}>
            <Chip label={translateFormFieldType(answer.field.type)} />

            <ViewOptionsIcon
              sx={{
                transform: expand ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
              }}
            />
          </Stack>
        </Stack>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          marginX: (theme) => theme.spacing(2),
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        {content && content.length > 0 ? (
          <Stack spacing={1} divider={<Divider flexItem />}>
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
      </AccordionDetails>
    </Paper>
  );
};

export default SectionAnswer;
