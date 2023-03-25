import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ControlledDniTextField } from '@indocal/ui';
import {
  Form,
  SectionFormFieldItem,
  DniFormFieldConfig,
} from '@indocal/services';

export interface DniItemProps {
  field: Form['fields'][number];
  item: SectionFormFieldItem;
}

export const DniItem: React.FC<DniItemProps> = ({ field, item }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<DniFormFieldConfig | null>(
    () => item.config as DniFormFieldConfig,
    [item.config]
  );

  return (
    <ControlledDniTextField
      name={`${field.id}.${item.title}`}
      label={item.title}
      description={item.description}
      control={control}
      textFieldProps={{
        size: 'small',
        required: config?.required,
        disabled: isSubmitting,
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

export default DniItem;
