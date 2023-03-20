import { useState, useMemo, createElement } from 'react';
import {
  Paper,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { ExpandMore as ViewOptionsIcon } from '@mui/icons-material';

import { NoData } from '@indocal/ui';
import {
  translateFormFieldType,
  FormFieldAnswer,
  TableFormFieldAnswer,
  TableFormFieldConfig,
} from '@indocal/services';

import {
  TextColumnAnswer,
  TextAreaColumnAnswer,
  NumberColumnAnswer,
  DniColumnAnswer,
  PhoneColumnAnswer,
  EmailColumnAnswer,
  CheckboxColumnAnswer,
  SelectColumnAnswer,
  RadioColumnAnswer,
  TimeColumnAnswer,
  DateColumnAnswer,
  DateTimeColumnAnswer,
  FilesColumnAnswer,
  UsersColumnAnswer,
} from './components';

export interface TableAnswerProps {
  answer: FormFieldAnswer;
}

export const TableAnswer: React.FC<TableAnswerProps> = ({ answer }) => {
  const [expand, setExpand] = useState(false);

  const config = useMemo(
    () => answer.field.config as TableFormFieldConfig | null,
    [answer]
  );

  const content = useMemo(
    () => answer.content as TableFormFieldAnswer | null,
    [answer]
  );

  const answers = useMemo(
    () => ({
      TEXT: TextColumnAnswer,
      TEXTAREA: TextAreaColumnAnswer,
      NUMBER: NumberColumnAnswer,

      DNI: DniColumnAnswer,
      PHONE: PhoneColumnAnswer,
      EMAIL: EmailColumnAnswer,

      CHECKBOX: CheckboxColumnAnswer,
      SELECT: SelectColumnAnswer,
      RADIO: RadioColumnAnswer,

      TIME: TimeColumnAnswer,
      DATE: DateColumnAnswer,
      DATETIME: DateTimeColumnAnswer,

      FILES: FilesColumnAnswer,

      USERS: UsersColumnAnswer,
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
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader size="small">
                {config && config.columns && config.columns.length && (
                  <TableHead>
                    <TableRow>
                      {config.columns.map((column) => (
                        <TableCell
                          key={column.heading}
                          align="center"
                          sx={{
                            ':not(:last-child)': {
                              borderRight: (theme) =>
                                `1px solid ${theme.palette.divider}`,
                            },
                          }}
                        >
                          {column.heading}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                )}

                <TableBody>
                  {content.map((row, index) => (
                    <TableRow key={index}>
                      {row.map((answer) => (
                        <TableCell
                          key={answer.column.heading}
                          align="center"
                          sx={{
                            minWidth: 225,
                            ':not(:last-child)': {
                              borderRight: (theme) =>
                                `1px solid ${theme.palette.divider}`,
                            },
                          }}
                        >
                          {createElement(answers[answer.column.type], {
                            key: answer.column.heading,
                            answer,
                          })}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          <NoData message="Campo no respondido" />
        )}
      </AccordionDetails>
    </Paper>
  );
};

export default TableAnswer;
