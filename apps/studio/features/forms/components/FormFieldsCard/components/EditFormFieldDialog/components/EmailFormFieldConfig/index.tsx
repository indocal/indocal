import { useFormContext } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../context';

export const EmailFormFieldConfig: React.FC = () => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext<EditFormFieldDialogData>();

  return (
    <ControlledCheckbox
      name="config.required"
      label="¿Campo requerido?"
      control={control}
      formControlProps={{ disabled: isSubmitting }}
    />
  );
};

export default EmailFormFieldConfig;
