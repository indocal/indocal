import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  CheckboxFormFieldConfig,
} from '@indocal/services';

export interface CheckboxColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
}

export const CheckboxColumn: React.FC<CheckboxColumnProps> = ({
  field,
  column,
  row,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<CheckboxFormFieldConfig | null>(
    () => column.config as CheckboxFormFieldConfig,
    [column.config]
  );

  return (
    <ControlledCheckbox
      name={`${field.id}.${row}.${column.id}`}
      label={column.heading}
      control={control}
      formControlProps={{
        disabled: isSubmitting,
      }}
      formHelperTextProps={{ sx: { marginX: 0 } }}
      controllerProps={{
        rules: {
          required: {
            value: Boolean(config?.required),
            message: 'Debe aceptar este campo',
          },
        },
      }}
    />
  );
};

export default CheckboxColumn;
