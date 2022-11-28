import { Box } from '@mui/material';
import { Control, FieldErrors } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';
import { Form, TableFormFieldColumn } from '@indocal/services';

export interface CheckboxColumnProps {
  field: Form['fields'][0];
  column: TableFormFieldColumn;
  row: number;
  isSubmitting: boolean;
  errors: FieldErrors;
  control: Control;
}

export const CheckboxColumn: React.FC<CheckboxColumnProps> = ({
  field,
  column,
  row,
  isSubmitting,
  errors,
  control,
}) => (
  <Box
    sx={{
      padding: (theme) => theme.spacing(1, 1.5, 0.5),
      borderRadius: (theme) => theme.spacing(0.5),
      border: (theme) =>
        errors[field.id] &&
        (errors[field.id] as FieldErrors)[row] &&
        ((errors[field.id] as FieldErrors)[row] as FieldErrors)[column.heading]
          ? `1px solid ${theme.palette.error.main}`
          : `1px solid ${theme.palette.divider}`,
    }}
  >
    <ControlledCheckbox
      name={`${field.id}.${row}.${column.heading}`}
      label={column.heading}
      control={control}
      formControlProps={{
        disabled: isSubmitting,
        required: field.config?.required,
      }}
      controllerProps={{
        rules: {
          required: {
            value: Boolean(field.config?.required),
            message: 'Debe aceptar este campo',
          },
        },
      }}
    />
  </Box>
);

export default CheckboxColumn;
