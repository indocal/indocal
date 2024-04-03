import {
  Autocomplete,
  TextField,
  Stack,
  Typography,
  Chip,
  AutocompleteProps,
  TextFieldProps,
} from '@mui/material';
import { Controller, Control, ControllerProps } from 'react-hook-form';

import {
  useForm,
  translateFormFieldType,
  UUID,
  Service,
  ServiceCertificateTemplatePlaceholder,
  ServiceCertificateTemplatePlaceholderType,
  FormFieldType,
  SectionFormFieldConfig,
  TableFormFieldConfig,
} from '@indocal/services';

type AssociatedField = {
  id: UUID;
  type: FormFieldType;
  name: string;
  description: string | null;
};

export interface ControlledCompatibleServiceFormFieldsAutocompleteProps {
  service: Service;
  placeholder: ServiceCertificateTemplatePlaceholder;
  name: string;
  label?: string;
  description?: string | null;
  control: Control;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  autocompleteProps?: Omit<
    AutocompleteProps<AssociatedField, boolean, boolean, false>,
    | 'multiple'
    | 'loading'
    | 'disabled'
    | 'options'
    | 'value'
    | 'onChange'
    | 'onInputChange'
    | 'isOptionEqualToValue'
    | 'getOptionLabel'
    | 'renderInput'
  >;
  textFieldProps?: Omit<
    TextFieldProps,
    'required' | 'label' | 'error' | 'helperText'
  >;
}

export const ControlledCompatibleServiceFormFieldsAutocomplete: React.FC<
  ControlledCompatibleServiceFormFieldsAutocompleteProps
> = ({
  service,
  placeholder,
  name,
  label,
  description,
  control,
  multiple,
  disabled,
  required,
  controllerProps,
  autocompleteProps,
  textFieldProps,
}) => {
  const {
    loading,
    validating,
    form,
    error: serviceError,
  } = useForm(service.form.id);

  const compatibility: Record<
    ServiceCertificateTemplatePlaceholderType,
    FormFieldType[]
  > = {
    [ServiceCertificateTemplatePlaceholderType.TEXT]: [
      'TEXT',
      'TEXTAREA',
      'NUMBER',
      'DNI',
      'PHONE',
      'EMAIL',
      'RADIO',
      'TIME',
      'DATE',
      'DATETIME',
    ],

    [ServiceCertificateTemplatePlaceholderType.IMAGE]: [],

    [ServiceCertificateTemplatePlaceholderType.SIGNATURE]: ['SIGNATURE'],

    [ServiceCertificateTemplatePlaceholderType.SECTION]: [],

    [ServiceCertificateTemplatePlaceholderType.TABLE]: [],
  };

  const compatibleFields: AssociatedField[] = form
    ? form.fields
        .map((field, row) => {
          if (field.type === 'SECTION') {
            const config = field.config as SectionFormFieldConfig | null;

            if (!config) return [];

            return config.items.map((item, index) => ({
              id: item.id,
              type: item.type,
              name: `${row + 1}.${index + 1}. ${item.title}`,
              description: field.title,
            }));
          }

          if (field.type === 'TABLE') {
            const config = field.config as TableFormFieldConfig | null;

            if (!config) return [];

            return config.columns.map((column, index) => ({
              id: column.id,
              type: column.type,
              name: `${row + 1}.${index + 1}. ${column.heading}`,
              description: field.title,
            }));
          }

          return {
            id: field.id,
            type: field.type,
            name: `${row + 1}. ${field.title}`,
            description: null,
          };
        })
        .flat()
        .filter((field) => compatibility[placeholder.type].includes(field.type))
    : [];

  return (
    <Controller
      {...controllerProps}
      name={name}
      control={control}
      render={({
        field: { value, onChange },
        fieldState: { error: fieldError },
      }) => (
        <Autocomplete
          {...autocompleteProps}
          multiple={multiple}
          loading={loading || validating}
          disabled={disabled}
          options={compatibleFields}
          value={multiple ? value ?? [] : value ?? null}
          onChange={(_, value) => onChange(value)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
          noOptionsText="No hay campos compatibles con este placeholder"
          renderInput={(params) => (
            <TextField
              {...params}
              {...textFieldProps}
              required={required}
              label={label}
              error={Boolean(serviceError) || Boolean(fieldError)}
              helperText={
                serviceError
                  ? serviceError.message
                  : Array.isArray(fieldError)
                  ? fieldError.reduce(
                      (acc, current) =>
                        acc ? `${acc} | ${current.message}` : current.message,
                      ``
                    )
                  : fieldError?.message || description
              }
            />
          )}
          renderOption={(props, option) => (
            <Stack
              component="li"
              direction="row"
              spacing={1}
              sx={{
                justifyContent: 'space-between !important',
                padding: (theme) => `${theme.spacing(1.5, 2)} !important`,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
              {...props}
            >
              <Stack>
                <Typography>{option.name}</Typography>

                {option.description && (
                  <Typography variant="caption">
                    {option.description}
                  </Typography>
                )}
              </Stack>

              <Chip label={translateFormFieldType(option.type)} />
            </Stack>
          )}
        />
      )}
    />
  );
};

export default ControlledCompatibleServiceFormFieldsAutocomplete;
