import { TextField, IconButton, Tooltip } from '@mui/material';
import { OfflineBolt as AutocompleteIcon } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';

import { ServiceCertificateTemplatePlaceholder } from '@indocal/services';

import { useGenerateCertificateDialog } from '../../context';

export interface TextPlaceholderFieldProps {
  placeholder: ServiceCertificateTemplatePlaceholder;
}

export const TextPlaceholderField: React.FC<TextPlaceholderFieldProps> = ({
  placeholder,
}) => {
  const { openAutocompletePopover } = useGenerateCertificateDialog();

  const {
    formState: { isSubmitting, errors },
    watch,
    register,
  } = useFormContext();

  const filled = Boolean(watch(placeholder.name));

  const handleAutocompleteClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void =>
    openAutocompletePopover(event.currentTarget, {
      type: 'TEXT',
      name: placeholder.name,
    });

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
      InputProps={{
        endAdornment: (
          <Tooltip title="Llenado Automatico" placement="top">
            <IconButton onClick={handleAutocompleteClick}>
              <AutocompleteIcon />
            </IconButton>
          </Tooltip>
        ),
      }}
    />
  );
};

export default TextPlaceholderField;
