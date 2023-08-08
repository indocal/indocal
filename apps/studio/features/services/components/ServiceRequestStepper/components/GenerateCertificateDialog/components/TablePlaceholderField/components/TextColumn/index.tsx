import { TextField, IconButton, Tooltip } from '@mui/material';
import { OfflineBolt as AutocompleteIcon } from '@mui/icons-material';
import { useFormContext, FieldErrors } from 'react-hook-form';

import {
  ServiceCertificateTemplatePlaceholder,
  ServiceCertificateTemplateTablePlaceholderColumn,
} from '@indocal/services';

import { useGenerateCertificateDialog } from '../../../../context';

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
  const { openAutocompletePopover } = useGenerateCertificateDialog();

  const {
    formState: { isSubmitting, errors },
    register,
  } = useFormContext();

  const key = `${placeholder.name}.${row}.${column.name}`;

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
      fullWidth
      size="small"
      placeholder="abc"
      disabled={isSubmitting}
      inputProps={register(key, {
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

export default TextColumn;
