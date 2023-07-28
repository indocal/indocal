import { TextField } from '@mui/material';
import { useFormContext, FieldErrors } from 'react-hook-form';

import {
  ServiceCertificateTemplatePlaceholder,
  ServiceCertificateTemplateTablePlaceholderColumn,
} from '@indocal/services';

export interface TextColumnProps {
  placeholder: ServiceCertificateTemplatePlaceholder;
  column: ServiceCertificateTemplateTablePlaceholderColumn;
  row: number;
}

export const TextColumn: React.FC<TextColumnProps> = ({
  placeholder,
  column,
  row,
}) => {
  const {
    formState: { isSubmitting, errors },
    register,
  } = useFormContext();

  return (
    <TextField
      required
      fullWidth
      size="small"
      placeholder="abc"
      disabled={isSubmitting}
      inputProps={register(`${placeholder.name}.${row}.${column.name}`, {
        required: {
          value: true,
          message: 'Debe completar este campo',
        },
      })}
      error={Boolean(
        errors[placeholder.name] &&
          (errors[placeholder.name] as FieldErrors)[row] &&
          ((errors[placeholder.name] as FieldErrors)[row] as FieldErrors)[
            column.name
          ]
      )}
      helperText={
        errors[placeholder.name] &&
        (errors[placeholder.name] as FieldErrors)[row] &&
        ((errors[placeholder.name] as FieldErrors)[row] as FieldErrors)[
          column.name
        ] &&
        (((errors[placeholder.name] as FieldErrors)[row] as FieldErrors)[
          column.name
        ]?.message as string)
      }
      FormHelperTextProps={{ sx: { marginX: 0 } }}
    />
  );
};

export default TextColumn;
