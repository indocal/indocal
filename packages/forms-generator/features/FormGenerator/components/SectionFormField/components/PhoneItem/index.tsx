import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ControlledPhoneTextField } from '@indocal/ui';
import {
  Form,
  SectionFormFieldItem,
  PhoneFormFieldConfig,
} from '@indocal/services';

export interface PhoneItemProps {
  field: Form['fields'][number];
  item: SectionFormFieldItem;
}

export const PhoneItem: React.FC<PhoneItemProps> = ({ field, item }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<PhoneFormFieldConfig | null>(
    () => item.config as PhoneFormFieldConfig,
    [item.config]
  );

  return (
    <ControlledPhoneTextField
      name={`${field.id}.${item.title}`}
      label={item.title}
      description={item.description}
      control={control}
      textFieldProps={{
        size: 'small',
        required: config?.required,
        disabled: isSubmitting,
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

export default PhoneItem;
