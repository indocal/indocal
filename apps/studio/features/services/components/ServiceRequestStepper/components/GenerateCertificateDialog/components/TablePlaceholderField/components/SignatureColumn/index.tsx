import { useFormContext } from 'react-hook-form';

import { ControlledSignaturePad } from '@indocal/ui';
import {
  ServiceCertificateTemplatePlaceholder,
  ServiceCertificateTemplateTablePlaceholderColumn,
} from '@indocal/services';

export interface SignatureColumnProps {
  placeholder: ServiceCertificateTemplatePlaceholder;
  column: ServiceCertificateTemplateTablePlaceholderColumn;
  row: number;
}

export const SignatureColumn: React.FC<SignatureColumnProps> = ({
  placeholder,
  column,
  row,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  return (
    <ControlledSignaturePad
      size="small"
      name={`${placeholder.name}.${row}.${column.name}`}
      control={control}
      formControlProps={{ disabled: isSubmitting }}
      formHelperTextProps={{ sx: { marginX: 0 } }}
      controllerProps={{
        rules: {
          required: {
            value: true,
            message: 'Debe completar este campo',
          },
        },
      }}
    />
  );
};

export default SignatureColumn;
