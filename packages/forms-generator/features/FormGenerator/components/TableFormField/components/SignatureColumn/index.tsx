import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ControlledSignaturePad } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  SignatureFormFieldConfig,
} from '@indocal/services';

export interface SignatureColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
}

export const SignatureColumn: React.FC<SignatureColumnProps> = ({
  field,
  column,
  row,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<SignatureFormFieldConfig | null>(
    () => column.config as SignatureFormFieldConfig | null,
    [column.config]
  );

  return (
    <ControlledSignaturePad
      size="small"
      name={`${field.id}.${row}.${column.id}`}
      control={control}
      formControlProps={{ disabled: isSubmitting }}
      formHelperTextProps={{ sx: { marginX: 0 } }}
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

export default SignatureColumn;
