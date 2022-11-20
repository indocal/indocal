import { useFormContext } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../context';

export const ApiFormFieldConfig: React.FC = () => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext<EditFormFieldDialogData>();

  return (
    <ControlledCheckbox
      name="config.api"
      label="¿Incluir en la respuesta?"
      control={control}
      formControlProps={{ disabled: isSubmitting }}
    />
  );
};

export default ApiFormFieldConfig;
