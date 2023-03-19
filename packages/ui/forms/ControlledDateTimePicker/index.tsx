import { TextField, TextFieldProps } from '@mui/material';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers';
import { Controller, ControllerProps, Control } from 'react-hook-form';

export interface ControlledDateTimePickerProps {
  name: string;
  label?: string;
  description?: string | null;
  control: Control;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  dateTimePickerProps?: Omit<
    DateTimePickerProps<Date, Date>,
    'label' | 'value' | 'onChange' | 'renderInput'
  >;
  textFieldProps?: Omit<TextFieldProps, 'error' | 'helperText'>;
}

export const ControlledDateTimePicker: React.FC<
  ControlledDateTimePickerProps
> = ({
  name,
  label,
  description,
  control,
  controllerProps,
  dateTimePickerProps,
  textFieldProps,
}) => (
  <Controller
    {...controllerProps}
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <DateTimePicker
        {...dateTimePickerProps}
        label={label}
        value={value ?? null}
        onChange={(value) => onChange(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            {...textFieldProps}
            error={Boolean(error)}
            helperText={error?.message || description}
          />
        )}
      />
    )}
  />
);

export default ControlledDateTimePicker;
