import { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { Controller, Control } from 'react-hook-form';

import { useUsersGroups } from '@indocal/services';

export interface ControlledUsersGroupsAutocompleteProps {
  name: string;
  label: string;
  control: Control;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export const ControlledUsersGroupsAutocomplete: React.FC<
  ControlledUsersGroupsAutocompleteProps
> = ({ name, label, control, multiple, disabled, required }) => {
  const [input, setInput] = useState<string>('');

  const {
    loading,
    validating,
    groups,
    error: serviceError,
  } = useUsersGroups({
    filters: {
      OR: [
        { name: { mode: 'insensitive', contains: input } },
        { description: { mode: 'insensitive', contains: input } },
      ],
    },
    orderBy: { name: 'asc' },
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
          options={groups}
          value={value ?? null}
          onChange={(_, value) => onChange(value)}
          onInputChange={(_, value) => setInput(value)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
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

export default ControlledUsersGroupsAutocomplete;
