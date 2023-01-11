import {
  Paper,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  Typography,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import {
  AddCircle as AddIcon,
  ArrowDropUp as ArrowUpIcon,
  ArrowDropDown as ArrowDownIcon,
  RemoveCircle as RemoveIcon,
} from '@mui/icons-material';
import { useFormContext, useFieldArray, Control } from 'react-hook-form';

import { NoData } from '@indocal/ui';
import { ControlledSuppliesAutocomplete } from '@indocal/forms-generator';

import { AddOrderDialogData } from '../../context';

export const OrderItemsTable: React.FC = () => {
  const {
    formState: { isSubmitting, errors },
    register,
    control,
  } = useFormContext<AddOrderDialogData>();

  const {
    fields: rows,
    append,
    swap,
    remove,
  } = useFieldArray({
    name: 'items',
  });

  return (
    <Paper
      sx={{
        display: 'grid',
        width: '100%',
        overflow: 'hidden',
        border: (theme) =>
          errors.items?.message
            ? `1px solid ${theme.palette.error.main}`
            : `1px solid ${theme.palette.divider}`,
      }}
    >
      <TableContainer sx={{ maxHeight: 350 }}>
        <Table stickyHeader size="small">
          {errors.items?.message && (
            <Typography
              component="caption"
              sx={{
                color: (theme) => `${theme.palette.error.main} !important`,
              }}
            >
              {errors.items.message}
            </Typography>
          )}

          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  borderRight: (theme) =>
                    errors.items?.message
                      ? `1px dashed ${theme.palette.error.main}`
                      : `1px dashed ${theme.palette.divider}`,
                }}
              >
                -
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  ...(errors.items?.message && {
                    color: (theme) => theme.palette.error.main,
                  }),
                }}
              >
                Recurso
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  ...(errors.items?.message && {
                    color: (theme) => theme.palette.error.main,
                  }),
                }}
              >
                Cantidad
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  ...(errors.items?.message && {
                    color: (theme) => theme.palette.error.main,
                  }),
                }}
              >
                Precio
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell
                    align="center"
                    sx={{
                      width: 75,
                      borderRight: (theme) =>
                        errors.items?.message
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

                  <TableCell align="center" sx={{ minWidth: 300 }}>
                    <ControlledSuppliesAutocomplete
                      required
                      name={`items.${index}.supply`}
                      control={control as unknown as Control}
                      disabled={isSubmitting}
                      textFieldProps={{
                        size: 'small',
                        placeholder: 'Recurso',
                      }}
                    />
                  </TableCell>

                  <TableCell align="center" sx={{ width: 175 }}>
                    <TextField
                      size="small"
                      type="number"
                      autoComplete="off"
                      placeholder="#"
                      disabled={isSubmitting}
                      inputProps={register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      error={
                        errors.items &&
                        errors.items[index] &&
                        Boolean(errors.items[index]?.quantity)
                      }
                      helperText={
                        errors.items &&
                        errors.items[index] &&
                        errors.items[index]?.quantity?.message
                      }
                    />
                  </TableCell>

                  <TableCell align="center" sx={{ width: 175 }}>
                    <TextField
                      size="small"
                      type="number"
                      autoComplete="off"
                      placeholder="#.##"
                      disabled={isSubmitting}
                      inputProps={register(`items.${index}.price`, {
                        valueAsNumber: true,
                      })}
                      error={
                        errors.items &&
                        errors.items[index] &&
                        Boolean(errors.items[index]?.price)
                      }
                      helperText={
                        errors.items &&
                        errors.items[index] &&
                        errors.items[index]?.price?.message
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  <NoData message="Sin artículos" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={4}
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

export default OrderItemsTable;
