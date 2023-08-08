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

import { NoData } from '@indocal/ui';
import {
  ServiceCertificateTemplatePlaceholder,
  ServiceCertificateTemplateTablePlaceholderConfig,
} from '@indocal/services';

import { TextColumn, SignatureColumn } from './components';

export interface TablePlaceholderFieldProps {
  placeholder: ServiceCertificateTemplatePlaceholder;
}

export const TablePlaceholderField: React.FC<TablePlaceholderFieldProps> = ({
  placeholder,
}) => {
  const {
    formState: { isSubmitting, errors },
  } = useFormContext();

  const config =
    useMemo<ServiceCertificateTemplateTablePlaceholderConfig | null>(
      () =>
        placeholder.config as ServiceCertificateTemplateTablePlaceholderConfig | null,
      [placeholder.config]
    );

  const {
    fields: rows,
    append,
    swap,
    remove,
  } = useFieldArray({
    name: placeholder.name,
    rules: {
      required: {
        value: true,
        message: 'Debe completar este campo',
      },
    },
  });

  const columns = useMemo(
    () => ({
      TEXT: TextColumn,
      SIGNATURE: SignatureColumn,
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
          errors[placeholder.name]?.root
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
            errors[placeholder.name]?.root
              ? `1px dashed ${theme.palette.error.main}`
              : `1px dashed ${theme.palette.divider}`,
        }}
      >
        <Badge
          badgeContent="*"
          slotProps={{ badge: { style: { top: 5, right: -5 } } }}
          sx={{
            ...(errors[placeholder.name]?.root && {
              color: (theme) => theme.palette.error.main,
            }),
          }}
        >
          <Typography>{placeholder.title}</Typography>
        </Badge>
      </Toolbar>

      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader size="small">
          {config &&
            config.columns &&
            config.columns.length &&
            errors[placeholder.name]?.root && (
              <Typography
                component="caption"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  ...(errors[placeholder.name]?.root && {
                    color: (theme) => `${theme.palette.error.main} !important`,
                  }),
                }}
              >
                {errors[placeholder.name]?.root?.message as string}
              </Typography>
            )}

          {config && config.columns && config.columns.length && (
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    borderRight: (theme) =>
                      errors[placeholder.name]?.root
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
                      ...(errors[placeholder.name]?.root && {
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
                          errors[placeholder.name]?.root
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
                          placeholder,
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

export default TablePlaceholderField;
