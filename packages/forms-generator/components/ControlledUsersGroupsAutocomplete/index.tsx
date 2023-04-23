import { useState } from 'react';
import {
  Autocomplete,
  TextField,
  AutocompleteProps,
  TextFieldProps,
  debounce,
} from '@mui/material';
import { Controller, Control, ControllerProps } from 'react-hook-form';

import { useUsersGroups, UserGroup } from '@indocal/services';

export interface ControlledUsersGroupsAutocompleteProps {
  name: string;
  label?: string;
  description?: string | null;
  control: Control;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  autocompleteProps?: Omit<
    AutocompleteProps<UserGroup, boolean, boolean, false>,
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

export const ControlledUsersGroupsAutocomplete: React.FC<
  ControlledUsersGroupsAutocompleteProps
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
    groups,
    error: serviceError,
  } = useUsersGroups({
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
          options={groups}
          value={multiple ? value ?? [] : value ?? null}
          onChange={(_, value) => onChange(value)}
          onInputChange={debounce((e) => setInput(e.target.value), 300)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
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

export default ControlledUsersGroupsAutocomplete;
