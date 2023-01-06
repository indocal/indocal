import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ControlledUsersAutocomplete } from '@indocal/forms-generator';
import {
  Form,
  SectionFormFieldItem,
  UsersFormFieldConfig,
} from '@indocal/services';

export interface UsersItemProps {
  field: Form['fields'][number];
  item: SectionFormFieldItem;
}

export const UsersItem: React.FC<UsersItemProps> = ({ field, item }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<UsersFormFieldConfig | null>(
    () => item.config as UsersFormFieldConfig,
    [item.config]
  );

  return (
    <ControlledUsersAutocomplete
      required={config?.required}
      multiple={config?.multiple}
      name={`${field.id}.${item.title}`}
      label={item.title}
      control={control}
      disabled={isSubmitting}
      textFieldProps={{
        size: 'small',
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

export default UsersItem;
