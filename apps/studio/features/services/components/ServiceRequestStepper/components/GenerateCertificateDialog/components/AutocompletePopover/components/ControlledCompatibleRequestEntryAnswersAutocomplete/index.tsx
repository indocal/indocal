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
  translateFormFieldType,
  ServiceRequest,
  ServiceCertificateTemplatePlaceholderType,
  FormFieldType,
  SectionFormFieldAnswer,
  TableFormFieldAnswer,
} from '@indocal/services';

import { Answer } from '../../types';

type Placeholder = {
  type: 'TEXT' | 'SIGNATURE';
  name: string;
};

export interface ControlledCompatibleRequestEntryAnswersAutocompleteProps {
  request: ServiceRequest;
  placeholder: Placeholder;
  name: string;
  label?: string;
  description?: string | null;
  control: Control;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  autocompleteProps?: Omit<
    AutocompleteProps<Answer, boolean, boolean, false>,
    | 'multiple'
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

export const ControlledCompatibleRequestEntryAnswersAutocomplete: React.FC<
  ControlledCompatibleRequestEntryAnswersAutocompleteProps
> = ({
  request,
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

  const compatibleAnswers: Answer[] = request.entry.answers
    .map((answer, answerIndex) => {
      if (answer.field.type === 'SECTION') {
        const content = answer.content as SectionFormFieldAnswer | null;

        if (!content) return [];

        return content.map(({ item, content }, index) => ({
          field: {
            id: item.id,
            type: item.type,
            title: `${answerIndex + 1}.${index + 1}. ${item.title}`,
            description: answer.field.title,
          },
          content: String(content),
        }));
      }

      if (answer.field.type === 'TABLE') {
        const content = answer.content as TableFormFieldAnswer | null;

        if (!content) return [];

        return content
          .map((row, rowIndex) =>
            row.map(({ column, content }) => ({
              field: {
                id: column.id,
                type: column.type,
                title: `${answerIndex + 1}.${rowIndex + 1} ${column.heading}`,
                description: answer.field.title,
              },
              content: String(content),
            }))
          )
          .flat();
      }

      return {
        field: {
          id: answer.field.id,
          type: answer.field.type,
          title: answer.field.title,
          description: null,
        },
        content: String(answer.content),
      };
    })
    .flat()
    .filter((answer) => {
      return compatibility[placeholder.type].includes(answer.field.type);
    });

  return (
    <Controller
      {...controllerProps}
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Autocomplete
          {...autocompleteProps}
          multiple={multiple}
          disabled={disabled}
          options={compatibleAnswers}
          value={multiple ? value ?? [] : value ?? null}
          onChange={(_, value) => onChange(value)}
          isOptionEqualToValue={(option, value) =>
            option.field.id === value.field.id
          }
          getOptionLabel={(option) => option.field.title}
          noOptionsText="No hay respuestas compatibles con este placeholder"
          renderInput={(params) => (
            <TextField
              {...params}
              {...textFieldProps}
              required={required}
              label={label}
              error={Boolean(error)}
              helperText={
                Array.isArray(error)
                  ? error.reduce(
                      (acc, current) =>
                        acc ? `${acc} | ${current.message}` : current.message,
                      ``
                    )
                  : error?.message || description
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
                <Typography>{option.field.title}</Typography>

                {option.field.description && (
                  <Typography variant="caption">
                    {option.field.description}
                  </Typography>
                )}
              </Stack>

              <Chip label={translateFormFieldType(option.field.type)} />
            </Stack>
          )}
        />
      )}
    />
  );
};

export default ControlledCompatibleRequestEntryAnswersAutocomplete;
