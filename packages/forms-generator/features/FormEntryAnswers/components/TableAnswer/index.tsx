import { useMemo } from 'react';
import {
  Paper,
  Stack,
  Divider,
  Typography,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
} from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  translateFormFieldType,
  FormFieldAnswer,
  TableFormFieldAnswer,
  TableFormFieldConfig,
} from '@indocal/services';

export interface TableAnswerProps {
  answer: FormFieldAnswer;
}

export const TableAnswer: React.FC<TableAnswerProps> = ({ answer }) => {
  const config = useMemo(
    () => answer.field.config as TableFormFieldConfig | null,
    [answer]
  );

  const content = useMemo(
    () => answer.content as TableFormFieldAnswer | null,
    [answer]
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
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
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
                    {row.map((column) => (
                      <TableCell
                        key={column.column.heading}
                        align="center"
                        sx={{
                          ':not(:last-child)': {
                            borderRight: (theme) =>
                              `1px solid ${theme.palette.divider}`,
                          },
                        }}
                      >
                        {JSON.stringify(column.content)}
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
    </Stack>
  );
};

export default TableAnswer;
