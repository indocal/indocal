import { useFormContext, Control } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../../../../../context';

export interface SignatureColumnConfigProps {
  column: number;
}

export const SignatureColumnConfig: React.FC<SignatureColumnConfigProps> = ({
  column,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext<EditFormFieldDialogData>();

  return (
    <ControlledCheckbox
      name={`config.columns.${column}.config.required`}
      label="¿Campo requerido?"
      control={control as unknown as Control}
      formControlProps={{ disabled: isSubmitting }}
    />
  );
};

export default SignatureColumnConfig;
