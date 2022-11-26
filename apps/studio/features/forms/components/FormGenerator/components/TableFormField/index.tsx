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
} from '@mui/material';
import {
  AddCircle as AddIcon,
  RemoveCircle as RemoveIcon,
} from '@mui/icons-material';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { Form, TableFormFieldConfig } from '@indocal/services';

export interface TableFormFieldProps {
  field: Form['fields'][0];
}

export const TableFormField: React.FC<TableFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const { fields, append, swap, remove } = useFieldArray({
    name: field.id,
    rules: { minLength: 0 },
  });

  const config = useMemo<TableFormFieldConfig | null>(
    () => field.config as TableFormFieldConfig,
    [field.config]
  );

  return (
    <Paper sx={{ border: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          borderBottom: (theme) => `1px dashed ${theme.palette.divider}`,
        }}
      >
        <Typography>{field.title}</Typography>
      </Toolbar>

      <TableContainer>
        <Table size="small">
          <caption>{field.title}</caption>

          <TableHead>
            <TableRow>
              {config?.columns.map((column) => (
                <TableCell key={column.heading}>{column.heading}</TableCell>
              ))}

              <TableCell>--</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                {config?.columns.map((column) => (
                  <TableCell key={column.heading}></TableCell>
                ))}

                <TableCell>
                  <IconButton
                    size="small"
                    color="error"
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
                size="small"
                colSpan={Number(config?.columns.length) + 1}
                sx={{ padding: (theme) => theme.spacing(0.25) }}
              >
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  color="inherit"
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
