import { useMemo, createElement } from 'react';
import {
  Paper,
  Stack,
  Toolbar,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  Typography,
  Button,
  IconButton,
  Badge,
} from '@mui/material';
import {
  AddCircle as AddIcon,
  TableRows as AddRowIcon,
  ArrowDropUp as ArrowUpIcon,
  ArrowDropDown as ArrowDownIcon,
  RemoveCircle as RemoveIcon,
} from '@mui/icons-material';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { Form, TableFormFieldConfig } from '@indocal/services';
import { NoData } from '@indocal/ui';

import {
  TextColumn,
  TextAreaColumn,
  NumberColumn,
  DniColumn,
  PhoneColumn,
  EmailColumn,
  CheckboxColumn,
  SelectColumn,
  RadioColumn,
  TimeColumn,
  DateColumn,
  DateTimeColumn,
  RatingColumn,
  SignatureColumn,
  FilesColumn,
  UsersColumn,
} from './components';

export interface TableFormFieldProps {
  field: Form['fields'][number];
}

export const TableFormField: React.FC<TableFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting, errors },
  } = useFormContext();

  const config = useMemo<TableFormFieldConfig | null>(
    () => field.config as TableFormFieldConfig | null,
    [field.config]
  );

  const {
    fields: rows,
    append,
    swap,
    remove,
  } = useFieldArray({
    name: field.id,
    rules: {
      required: {
        value: Boolean(config?.required),
        message: 'Debe completar este campo',
      },

      ...(typeof config?.minRows === 'number' &&
        !isNaN(config.minRows) && {
          minLength: {
            value: config.minRows,
            message: `Debe completar un mínimo de ${config.minRows} filas`,
          },
        }),

      ...(typeof config?.maxRows === 'number' &&
        !isNaN(config.maxRows) && {
          maxLength: {
            value: config.maxRows,
            message: `Debe completar un máximo de ${config.maxRows} filas`,
          },
        }),
    },
  });

  const columns = useMemo(
    () => ({
      TEXT: TextColumn,
      TEXTAREA: TextAreaColumn,
      NUMBER: NumberColumn,

      DNI: DniColumn,
      PHONE: PhoneColumn,
      EMAIL: EmailColumn,

      CHECKBOX: CheckboxColumn,
      SELECT: SelectColumn,
      RADIO: RadioColumn,

      TIME: TimeColumn,
      DATE: DateColumn,
      DATETIME: DateTimeColumn,

      SIGNATURE: SignatureColumn,

      RATING: RatingColumn,

      FILES: FilesColumn,

      USERS: UsersColumn,
    }),
    []
  );

  return (
    <Paper
      sx={{
        display: 'grid',
        width: '100%',
        overflow: 'hidden',
        border: (theme) =>
          errors[field.id]?.root
            ? `1px solid ${theme.palette.error.main}`
            : `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar
        disableGutters
        variant="dense"
        sx={{
          paddingX: (theme) => theme.spacing(2),
          borderBottom: (theme) =>
            errors[field.id]?.root
              ? `1px dashed ${theme.palette.error.main}`
              : `1px dashed ${theme.palette.divider}`,
        }}
      >
        <Badge
          badgeContent="*"
          invisible={!config?.required}
          slotProps={{ badge: { style: { top: 5, right: -5 } } }}
          sx={{
            ...(errors[field.id]?.root && {
              color: (theme) => theme.palette.error.main,
            }),
          }}
        >
          <Typography>{field.title}</Typography>
        </Badge>
      </Toolbar>

      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader size="small">
          {config &&
            config.columns &&
            config.columns.length &&
            (errors[field.id]?.root || field.description) && (
              <Typography
                component="caption"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  ...(errors[field.id]?.root && {
                    color: (theme) => `${theme.palette.error.main} !important`,
                  }),
                }}
              >
                {(errors[field.id]?.root?.message as string) ||
                  field.description}
              </Typography>
            )}

          {config && config.columns && config.columns.length && (
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    borderRight: (theme) =>
                      errors[field.id]?.root
                        ? `1px dashed ${theme.palette.error.main}`
                        : `1px dashed ${theme.palette.divider}`,
                  }}
                >
                  -
                </TableCell>

                {config.columns.map((column) => (
                  <TableCell
                    key={column.heading}
                    align="center"
                    sx={{
                      ':not(:last-child)': {
                        borderRight: (theme) =>
                          `1px solid ${theme.palette.divider}`,
                      },
                      ...(errors[field.id]?.root && {
                        color: (theme) => theme.palette.error.main,
                      }),
                    }}
                  >
                    {column.heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          )}

          <TableBody>
            {config && config.columns && config.columns.length > 0 ? (
              rows.length > 0 ? (
                rows.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell
                      align="center"
                      sx={{
                        borderRight: (theme) =>
                          errors[field.id]?.root
                            ? `1px dashed ${theme.palette.error.main}`
                            : `1px dashed ${theme.palette.divider}`,
                      }}
                    >
                      <Stack
                        justifyContent="center"
                        alignItems="center"
                        spacing={0.5}
                      >
                        <Stack direction="row" spacing={0.5}>
                          <IconButton
                            size="small"
                            disabled={isSubmitting || index === 0}
                            onClick={() => swap(index, index - 1)}
                          >
                            <ArrowUpIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            disabled={isSubmitting || rows.length - 1 === index}
                            onClick={() => swap(index, index + 1)}
                          >
                            <ArrowDownIcon fontSize="small" />
                          </IconButton>
                        </Stack>

                        <IconButton
                          size="small"
                          color="error"
                          disabled={isSubmitting}
                          onClick={() => remove(index)}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>

                    {config.columns.map((column) => (
                      <TableCell
                        key={column.heading}
                        align="center"
                        sx={{
                          minWidth: 225,
                          ':not(:last-child)': {
                            borderRight: (theme) =>
                              `1px solid ${theme.palette.divider}`,
                          },
                        }}
                      >
                        {createElement(columns[column.type], {
                          field,
                          column,
                          row: index,
                        })}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={config.columns.length + 1}
                    sx={{
                      opacity: 0.75,
                      backgroundColor: (theme) =>
                        theme.palette.action.disabledBackground,
                    }}
                  >
                    <Stack
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                      spacing={0.5}
                      sx={{ padding: (theme) => theme.spacing(4, 2) }}
                    >
                      <AddRowIcon />

                      <Typography align="center">
                        Haz click en el botón de abajo para agregar una fila
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            ) : (
              <TableRow>
                <TableCell>
                  <NoData message="Esta tabla no contiene columnas definidas" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {config && config.columns && config.columns.length && (
            <TableFooter>
              <TableRow>
                <TableCell
                  colSpan={config.columns.length + 1}
                  sx={{ padding: (theme) => theme.spacing(0.25) }}
                >
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    color="inherit"
                    disabled={isSubmitting}
                    onClick={() => append(undefined)}
                  >
                    <AddIcon fontSize="small" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TableFormField;
