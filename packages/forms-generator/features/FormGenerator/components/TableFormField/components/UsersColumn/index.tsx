import { Control } from 'react-hook-form';

import { ControlledUsersAutocomplete } from '@indocal/forms-generator';
import {
  Form,
  TableFormFieldColumn,
  TableFormFieldColumnConfig,
  UsersFormFieldConfig,
} from '@indocal/services';

export interface UsersColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  config: TableFormFieldColumnConfig | null;
  row: number;
  isSubmitting: boolean;
  control: Control;
}

export const UsersColumn: React.FC<UsersColumnProps> = ({
  field,
  column,
  config,
  row,
  isSubmitting,
  control,
}) => (
  <ControlledUsersAutocomplete
    required={config?.required}
    multiple={(config as UsersFormFieldConfig)?.multiple}
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

export default UsersColumn;
