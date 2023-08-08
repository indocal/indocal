import { TextField, IconButton, Tooltip } from '@mui/material';
import { OfflineBolt as AutocompleteIcon } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';

import {
  ServiceCertificateTemplatePlaceholder,
  ServiceCertificateTemplateSectionPlaceholderItem,
} from '@indocal/services';

import { useGenerateCertificateDialog } from '../../../../context';

export interface TextItemProps {
  placeholder: ServiceCertificateTemplatePlaceholder;
  item: ServiceCertificateTemplateSectionPlaceholderItem;
}

export const TextItem: React.FC<TextItemProps> = ({ placeholder, item }) => {
  const { openAutocompletePopover } = useGenerateCertificateDialog();

  const {
    formState: { isSubmitting, errors },
    watch,
    register,
  } = useFormContext();

  const key = `${placeholder.name}__${item.name}`;

  const filled = Boolean(watch(key));

  const handleAutocompleteClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void =>
    openAutocompletePopover(event.currentTarget, {
      type: 'TEXT',
      name: key,
    });

  return (
    <TextField
      required
      autoComplete="off"
      fullWidth
      size="small"
      label={item.title}
      disabled={isSubmitting}
      inputProps={register(key, {
        required: {
          value: true,
          message: 'Debe completar este campo',
        },
      })}
      error={Boolean(errors[key])}
      helperText={errors[key]?.message as string}
      InputLabelProps={{ shrink: filled }}
      InputProps={{
        endAdornment: (
          <Tooltip title="Llenado Automatico" placement="top">
            <IconButton size="small" onClick={handleAutocompleteClick}>
              <AutocompleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      }}
    />
  );
};

export default TextItem;
