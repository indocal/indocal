import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ControlledPhoneTextField } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  PhoneFormFieldConfig,
} from '@indocal/services';

export interface PhoneColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
}

export const PhoneColumn: React.FC<PhoneColumnProps> = ({
  field,
  column,
  row,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<PhoneFormFieldConfig | null>(
    () => column.config as PhoneFormFieldConfig,
    [column.config]
  );

  return (
    <ControlledPhoneTextField
      name={`${field.id}.${row}.${column.id}`}
      control={control}
      textFieldProps={{
        size: 'small',

        disabled: isSubmitting,
        required: config?.required,
        FormHelperTextProps: { sx: { marginX: 0 } },
      }}
      controllerProps={{
        rules: {
          required: {
            value: Boolean(config?.required),
            message: 'Debe completar este campo',
          },

          minLength: {
            value: 14,
            message: 'Debe ingresar un número de teléfono válido',
          },

          maxLength: {
            value: 14,
            message: 'Debe ingresar un número de teléfono válido',
          },
        },
      }}
    />
  );
};

export default PhoneColumn;
