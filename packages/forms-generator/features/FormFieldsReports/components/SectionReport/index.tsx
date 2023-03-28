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
  FormFieldReport,
  SectionFormFieldReport,
} from '@indocal/services';

import {
  TextItemReport,
  TextAreaItemReport,
  NumberItemReport,
  DniItemReport,
  PhoneItemReport,
  EmailItemReport,
  CheckboxItemReport,
  SelectItemReport,
  RadioItemReport,
  TimeItemReport,
  DateItemReport,
  DateTimeItemReport,
  FilesItemReport,
  UsersItemReport,
} from './components';

export interface SectionReportProps {
  report: FormFieldReport;
}

export const SectionReport: React.FC<SectionReportProps> = ({ report }) => {
  const [expand, setExpand] = useState(false);

  const content = useMemo(
    () => report.content as SectionFormFieldReport,
    [report]
  );

  const reports = useMemo(
    () => ({
      TEXT: TextItemReport,
      TEXTAREA: TextAreaItemReport,
      NUMBER: NumberItemReport,

      DNI: DniItemReport,
      PHONE: PhoneItemReport,
      EMAIL: EmailItemReport,

      CHECKBOX: CheckboxItemReport,
      SELECT: SelectItemReport,
      RADIO: RadioItemReport,

      TIME: TimeItemReport,
      DATE: DateItemReport,
      DATETIME: DateTimeItemReport,

      FILES: FilesItemReport,

      USERS: UsersItemReport,
    }),
    []
  );

  return (
    <Paper
      component={Accordion}
      disableGutters
      elevation={2}
      expanded={expand}
      onChange={() => setExpand(!expand)}
      sx={{
        paddingY: (theme) => theme.spacing(1),
        '&:before': { display: 'none' },
      }}
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
            <Typography variant="h6">{report.field.title}</Typography>

            {report.field.description && (
              <Typography
                component="pre"
                variant="caption"
                color="text.secondary"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {report.field.description}
              </Typography>
            )}
          </Stack>

          <Stack alignSelf="flex-start" alignItems="center" spacing={1}>
            <Chip label={translateFormFieldType(report.field.type)} />

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
            {content.map((report) =>
              createElement(reports[report.item.type], {
                key: report.item.title,
                report,
              })
            )}
          </Stack>
        ) : (
          <NoData />
        )}
      </AccordionDetails>
    </Paper>
  );
};

export default SectionReport;
