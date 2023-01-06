import { useMemo } from 'react';
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
  UsersColumn,
} from './components';

export interface TableFormFieldProps {
  field: Form['fields'][number];
}

export const TableFormField: React.FC<TableFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting, errors },
    register,
    control,
  } = useFormContext();

  const config = useMemo<TableFormFieldConfig | null>(
    () => field.config as TableFormFieldConfig,
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

      ...(config?.minRows && {
        minLength: {
          value: config.minRows,
          message: `Debe completar un mínimo de ${config.minRows} filas`,
        },
      }),

      ...(config?.maxRows && {
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
        variant="dense"
        sx={{
          borderBottom: (theme) =>
            errors[field.id]?.root
              ? `1px dashed ${theme.palette.error.main}`
              : `1px dashed ${theme.palette.divider}`,
        }}
      >
        <Badge
          badgeContent="*"
          invisible={!config?.required}
          componentsProps={{ badge: { style: { top: 5, right: -5 } } }}
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
          {config?.columns.length &&
            (errors[field.id]?.root || field.description) && (
              <Typography
                component="caption"
                sx={{
                  ...(errors[field.id]?.root && {
                    color: (theme) => `${theme.palette.error.main} !important`,
                  }),
                }}
              >
                {(errors[field.id]?.root?.message as string) ||
                  field.description}
              </Typography>
            )}

          {config?.columns.length && (
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
                    sx={{
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
            {config && config.columns.length > 0 ? (
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

                  {config?.columns.map((column) => (
                    <TableCell key={column.heading} sx={{ minWidth: 225 }}>
                      {columns[column.type]({
                        field,
                        column,
                        row: index,
                        config: column.config,
                        isSubmitting,
                        errors,
                        register,
                        control,
                      })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>
                  <NoData message="Esta tabla no contiene columnas definidas" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {config?.columns.length && (
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
