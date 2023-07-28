import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { ServiceCertificateTemplatePlaceholder } from '@indocal/services';

export interface TextPlaceholderFieldProps {
  placeholder: ServiceCertificateTemplatePlaceholder;
}

export const TextPlaceholderField: React.FC<TextPlaceholderFieldProps> = ({
  placeholder,
}) => {
  const {
    formState: { isSubmitting, errors },
    watch,
    register,
  } = useFormContext();

  const filled = Boolean(watch(placeholder.name));

  return (
    <TextField
      required
      autoComplete="off"
      label={placeholder.title}
      disabled={isSubmitting}
      inputProps={register(placeholder.name, {
        required: 'Debe completar este campo',
      })}
      error={Boolean(errors[placeholder.name])}
      helperText={errors[placeholder.name]?.message as string}
      InputLabelProps={{ shrink: filled }}
    />
  );
};

export default TextPlaceholderField;
