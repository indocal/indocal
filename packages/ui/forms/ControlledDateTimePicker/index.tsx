import { TextField, TextFieldProps } from '@mui/material';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers';
import { Controller, ControllerProps, Control } from 'react-hook-form';

export interface ControlledDateTimePickerProps {
  name: string;
  label: string;
  control: Control;
  controllerProps?: Omit<ControllerProps, 'name' | 'render'>;
  dateTimePickerProps?: DateTimePickerProps<Date, Date>;
  textFieldProps?: TextFieldProps;
}

export const ControlledDateTimePicker: React.FC<
  ControlledDateTimePickerProps
> = ({
  name,
  label,
  control,
  controllerProps,
  dateTimePickerProps,
  textFieldProps,
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <DateTimePicker
        label={label}
        value={value}
        onChange={(value) => onChange(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            error={Boolean(error)}
            helperText={error?.message}
            {...textFieldProps}
          />
        )}
        {...dateTimePickerProps}
      />
    )}
    {...controllerProps}
  />
);

export default ControlledDateTimePicker;
