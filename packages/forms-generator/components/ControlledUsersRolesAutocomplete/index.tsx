import { useState } from 'react';
import {
  Autocomplete,
  TextField,
  AutocompleteProps,
  TextFieldProps,
} from '@mui/material';
import { Controller, Control, ControllerProps } from 'react-hook-form';

import { useUsersRoles, UserRole } from '@indocal/services';

export interface ControlledUsersRolesAutocompleteProps {
  name: string;
  label?: string;
  description?: string | null;
  control: Control;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  autocompleteProps?: Omit<
    AutocompleteProps<UserRole, boolean, boolean, false>,
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

export const ControlledUsersRolesAutocomplete: React.FC<
  ControlledUsersRolesAutocompleteProps
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
    roles,
    error: serviceError,
  } = useUsersRoles({
    filters: {
      OR: [
        { id: { mode: 'insensitive', contains: input } },
        { name: { mode: 'insensitive', contains: input } },
        { description: { mode: 'insensitive', contains: input } },
      ],
    },
    orderBy: { name: 'asc' },
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
          options={roles}
          value={multiple ? value ?? [] : value ?? null}
          onChange={(_, value) => onChange(value)}
          onInputChange={(_, value) => setInput(value)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => `${option.name} (${option.type})`}
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

export default ControlledUsersRolesAutocomplete;
