import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ControlledDniTextField } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  DniFormFieldConfig,
} from '@indocal/services';

export interface DniColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
}

export const DniColumn: React.FC<DniColumnProps> = ({
  field,
  column,

  row,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<DniFormFieldConfig | null>(
    () => column.config as DniFormFieldConfig,
    [column.config]
  );

  return (
    <ControlledDniTextField
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
            value: 13,
            message: 'Debe ingresar un número de cédula válido',
          },

          maxLength: {
            value: 13,
            message: 'Debe ingresar un número de cédula válido',
          },
        },
      }}
    />
  );
};

export default DniColumn;
