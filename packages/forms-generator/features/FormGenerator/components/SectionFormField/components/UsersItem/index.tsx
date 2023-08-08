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
    () => item.config as UsersFormFieldConfig | null,
    [item.config]
  );

  return (
    <ControlledUsersAutocomplete
      required={config?.required}
      multiple={config?.multiple}
      name={`${field.id}.${item.id}`}
      label={item.title}
      description={item.description}
      control={control}
      disabled={isSubmitting}
      textFieldProps={{
        size: 'small',
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

export default UsersItem;
