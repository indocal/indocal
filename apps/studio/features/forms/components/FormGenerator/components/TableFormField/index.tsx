import { useMemo } from 'react';
import {
  Paper,
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
  RemoveCircle as RemoveIcon,
} from '@mui/icons-material';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { Form, TableFormFieldConfig } from '@indocal/services';

import {
  TextColumn,
  TextAreaColumn,
  NumberColumn,
  DniColumn,
  PhoneColumn,
  EmailColumn,
  CheckboxColumn,
  TimeColumn,
  DateColumn,
  DateTimeColumn,
  UsersColumn,
} from './components';

export interface TableFormFieldProps {
  field: Form['fields'][0];
}

export const TableFormField: React.FC<TableFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting, errors },
    register,
    control,
  } = useFormContext();

  const {
    fields: rows,
    append,
    remove,
  } = useFieldArray({
    name: field.id,
    rules: {
      required: {
        value: Boolean(field.config?.required),
        message: 'Debe completar este campo',
      },
    },
  });

  const config = useMemo<TableFormFieldConfig | null>(
    () => field.config as TableFormFieldConfig,
    [field.config]
  );

  const columns = useMemo(
    () => ({
      TEXT: TextColumn,
      TEXTAREA: TextAreaColumn,
      NUMBER: NumberColumn,

      DNI: DniColumn,
      PHONE: PhoneColumn,
      EMAIL: EmailColumn,

      CHECKBOX: CheckboxColumn,
      SELECT: TextColumn,
      RADIO: TextColumn,

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

      <TableContainer>
        <Table size="small">
          {(errors[field.id]?.root || field.description) && (
            <Typography
              component="caption"
              sx={{
                ...(errors[field.id]?.root && {
                  color: (theme) => `${theme.palette.error.main} !important`,
                }),
              }}
            >
              {(errors[field.id]?.root?.message as string) || field.description}
            </Typography>
          )}

          <TableHead>
            <TableRow>
              {config?.columns.map((column) => (
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

              <TableCell
                align="center"
                sx={{
                  ...(config &&
                    config.columns.length > 0 && {
                      borderLeft: (theme) =>
                        errors[field.id]?.root
                          ? `1px dashed ${theme.palette.error.main}`
                          : `1px dashed ${theme.palette.divider}`,
                    }),
                }}
              >
                -
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id}>
                {config?.columns.map((column) => (
                  <TableCell key={column.heading} sx={{ minWidth: 225 }}>
                    {columns[column.type]({
                      field,
                      column,
                      row: index,
                      isSubmitting,
                      errors,
                      register,
                      control,
                    })}
                  </TableCell>
                ))}

                <TableCell
                  align="center"
                  sx={{
                    ...(config &&
                      config.columns.length > 0 && {
                        borderLeft: (theme) =>
                          errors[field.id]?.root
                            ? `1px dashed ${theme.palette.error.main}`
                            : `1px dashed ${theme.palette.divider}`,
                      }),
                  }}
                >
                  <IconButton
                    size="small"
                    color="error"
                    disabled={isSubmitting}
                    onClick={() => remove(index)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={config ? config.columns.length + 1 : 1}
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
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TableFormField;
