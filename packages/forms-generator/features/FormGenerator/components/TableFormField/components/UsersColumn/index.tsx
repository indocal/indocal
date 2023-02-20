import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ControlledUsersAutocomplete } from '@indocal/forms-generator';
import {
  Form,
  TableFormFieldColumn,
  UsersFormFieldConfig,
} from '@indocal/services';

export interface UsersColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
}

export const UsersColumn: React.FC<UsersColumnProps> = ({
  field,
  column,
  row,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<UsersFormFieldConfig | null>(
    () => column.config as UsersFormFieldConfig,
    [column.config]
  );

  return (
    <ControlledUsersAutocomplete
      required={config?.required}
      multiple={config?.multiple}
      name={`${field.id}.${row}.${column.heading}`}
      control={control}
      disabled={isSubmitting}
      textFieldProps={{
        size: 'small',
        placeholder: 'Usuarios',
        FormHelperTextProps: { sx: { marginX: 0 } },
      }}
      controllerProps={{
        rules: {
          required: {
            value: Boolean(config?.required),
            message: 'Debe completar este campo',
          },
        },
      }}
    />
  );
};

export default UsersColumn;
