import { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { Controller, Control } from 'react-hook-form';

import { useUsers } from '@indocal/services';

export interface ControlledUsersAutocompleteProps {
  name: string;
  label: string;
  control: Control;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export const ControlledUsersAutocomplete: React.FC<
  ControlledUsersAutocompleteProps
> = ({ name, label, control, multiple, disabled, required }) => {
  const [input, setInput] = useState<string>('');

  const {
    loading,
    validating,
    users,
    error: serviceError,
  } = useUsers({
    filters: {
      OR: [
        { username: { mode: 'insensitive', contains: input } },
        { email: { mode: 'insensitive', contains: input } },
      ],
    },
    orderBy: { username: 'asc' },
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value, onChange },
        fieldState: { error: fieldError },
      }) => (
        <Autocomplete
          multiple={multiple}
          loading={loading || validating}
          disabled={disabled}
          options={users}
          value={value ?? null}
          onChange={(_, value) => onChange(value)}
          onInputChange={(_, value) => setInput(value)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.username}
          renderInput={(params) => (
            <TextField
              {...params}
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
                  : fieldError?.message
              }
            />
          )}
        />
      )}
    />
  );
};

export default ControlledUsersAutocomplete;
