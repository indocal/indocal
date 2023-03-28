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
  TableFormFieldReport,
} from '@indocal/services';

import {
  TextColumnReport,
  TextAreaColumnReport,
  NumberColumnReport,
  DniColumnReport,
  PhoneColumnReport,
  EmailColumnReport,
  CheckboxColumnReport,
  SelectColumnReport,
  RadioColumnReport,
  TimeColumnReport,
  DateColumnReport,
  DateTimeColumnReport,
  FilesColumnReport,
  UsersColumnReport,
} from './components';

export interface TableReportProps {
  report: FormFieldReport;
}

export const TableReport: React.FC<TableReportProps> = ({ report }) => {
  const [expand, setExpand] = useState(false);

  const content = useMemo(
    () => report.content as TableFormFieldReport,
    [report]
  );

  const reports = useMemo(
    () => ({
      TEXT: TextColumnReport,
      TEXTAREA: TextAreaColumnReport,
      NUMBER: NumberColumnReport,

      DNI: DniColumnReport,
      PHONE: PhoneColumnReport,
      EMAIL: EmailColumnReport,

      CHECKBOX: CheckboxColumnReport,
      SELECT: SelectColumnReport,
      RADIO: RadioColumnReport,

      TIME: TimeColumnReport,
      DATE: DateColumnReport,
      DATETIME: DateTimeColumnReport,

      FILES: FilesColumnReport,

      USERS: UsersColumnReport,
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
              createElement(reports[report.column.type], {
                key: report.column.heading,
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

export default TableReport;
