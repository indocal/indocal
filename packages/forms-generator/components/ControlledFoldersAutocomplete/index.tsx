import { useState, useMemo } from 'react';
import {
  Autocomplete,
  TextField,
  AutocompleteProps,
  TextFieldProps,
  debounce,
} from '@mui/material';
import { Controller, Control, ControllerProps } from 'react-hook-form';

import { useFolders, Folder } from '@indocal/services';

export interface ControlledFoldersAutocompleteProps {
  name: string;
  label?: string;
  description?: string | null;
  control: Control;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  autocompleteProps?: Omit<
    AutocompleteProps<Folder, boolean, boolean, false>,
    | 'multiple'
    | 'loading'
    | 'disabled'
    | 'options'
    | 'value'
    | 'onChange'
    | 'onInputChange'
    | 'isOptionEqualToValue'
    | 'getOptionLabel'
    | 'groupBy'
    | 'renderInput'
  >;
  textFieldProps?: Omit<
    TextFieldProps,
    'required' | 'label' | 'error' | 'helperText'
  >;
}

export const ControlledFoldersAutocomplete: React.FC<
  ControlledFoldersAutocompleteProps
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
    folders,
    error: serviceError,
  } = useFolders({
    filters: {
      OR: [
        { id: { mode: 'insensitive', contains: input } },
        { name: { mode: 'insensitive', contains: input } },
      ],
    },
    orderBy: { name: 'asc' },
  });

  const sortedByFolder = useMemo(
    () =>
      folders.sort((a, b) => {
        if (a.folder && b.folder) {
          return a.folder.name.localeCompare(b.folder.name);
        } else if (a.folder) {
          return 1;
        } else if (b.folder) {
          return -1;
        } else {
          return 0;
        }
      }),

    [folders]
  );

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
          options={sortedByFolder}
          value={multiple ? value ?? [] : value ?? null}
          onChange={(_, value) => onChange(value)}
          onInputChange={debounce((e) => setInput(e.target.value), 400)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
          groupBy={({ folder }) => folder?.name ?? 'Librería de archivos'}
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

export default ControlledFoldersAutocomplete;
