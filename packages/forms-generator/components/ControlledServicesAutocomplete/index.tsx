import { useState } from 'react';
import {
  Autocomplete,
  TextField,
  AutocompleteProps,
  TextFieldProps,
  debounce,
} from '@mui/material';
import { Controller, Control, ControllerProps } from 'react-hook-form';

import { useServices, Service } from '@indocal/services';

export interface ControlledServicesAutocompleteProps {
  name: string;
  label?: string;
  description?: string | null;
  control: Control;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  autocompleteProps?: Omit<
    AutocompleteProps<Service, boolean, boolean, false>,
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

export const ControlledServicesAutocomplete: React.FC<
  ControlledServicesAutocompleteProps
> = ({
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
  const [input, setInput] = useState<string>('');

  const {
    loading,
    validating,
    services,
    error: serviceError,
  } = useServices({
    filters: {
      OR: [
        { id: { mode: 'insensitive', contains: input } },
        { title: { mode: 'insensitive', contains: input } },
        { description: { mode: 'insensitive', contains: input } },
      ],
    },
    orderBy: { title: 'asc' },
  });

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
          options={services}
          value={multiple ? value ?? [] : value ?? null}
          onChange={(_, value) => onChange(value)}
          onInputChange={debounce((_, value) => setInput(value), 400)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.title}
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
        />
      )}
    />
  );
};

export default ControlledServicesAutocomplete;
