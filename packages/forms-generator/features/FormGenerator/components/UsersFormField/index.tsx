import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ControlledUsersAutocomplete } from '@indocal/forms-generator';
import { Form, UsersFormFieldConfig } from '@indocal/services';

export interface UsersFormFieldProps {
  field: Form['fields'][number];
}

export const UsersFormField: React.FC<UsersFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<UsersFormFieldConfig | null>(
    () => field.config as UsersFormFieldConfig | null,
    [field.config]
  );

  return (
    <ControlledUsersAutocomplete
      required={config?.required}
      multiple={config?.multiple}
      name={field.id}
      label={field.title}
      description={field.description}
      control={control}
      disabled={isSubmitting}
      textFieldProps={{
        FormHelperTextProps: {
          sx: {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          },
        },
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

export default UsersFormField;
