import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { Form, UsersFormFieldConfig } from '@indocal/services';

import { ControlledUsersAutocomplete } from '@/features';

export interface UsersFormFieldProps {
  field: Form['fields'][number];
}

export const UsersFormField: React.FC<UsersFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<UsersFormFieldConfig | null>(
    () => field.config as UsersFormFieldConfig,
    [field.config]
  );

  return (
    <ControlledUsersAutocomplete
      required={config?.required}
      multiple={config?.multiple}
      name={field.id}
      label={field.title}
      control={control}
      disabled={isSubmitting}
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
