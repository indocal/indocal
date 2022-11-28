import { Control } from 'react-hook-form';

import { Form, TableFormFieldColumn } from '@indocal/services';

import { ControlledUsersAutocomplete } from '@/features';

export interface UsersColumnProps {
  field: Form['fields'][0];
  column: TableFormFieldColumn;
  row: number;
  isSubmitting: boolean;
  control: Control;
}

export const UsersColumn: React.FC<UsersColumnProps> = ({
  field,
  column,
  row,
  isSubmitting,
  control,
}) => (
  <ControlledUsersAutocomplete
    required={field.config?.required}
    // multiple={config?.multiple} // TODO: implement it
    name={`${field.id}.${row}.${column.heading}`}
    control={control}
    disabled={isSubmitting}
    textFieldProps={{
      size: 'small',
      placeholder: 'multiple' ? 'Usuarios' : 'Usuario',
      FormHelperTextProps: { sx: { marginX: 0 } },
    }}
    controllerProps={{
      rules: {
        required: {
          value: Boolean(field.config?.required),
          message: 'Debe completar este campo',
        },
      },
    }}
  />
);

export default UsersColumn;
