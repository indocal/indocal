import { TextField, TextFieldProps } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { Controller, ControllerProps, Control } from 'react-hook-form';

export interface ControlledDatePickerProps {
  name: string;
  label: string;
  control: Control;
  controllerProps?: Omit<ControllerProps, 'name' | 'render'>;
  datePickerProps?: DatePickerProps<Date, Date>;
  textFieldProps?: TextFieldProps;
}

export const ControlledDatePicker: React.FC<ControlledDatePickerProps> = ({
  name,
  label,
  control,
  controllerProps,
  datePickerProps,
  textFieldProps,
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <DatePicker
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
        {...datePickerProps}
      />
    )}
    {...controllerProps}
  />
);

export default ControlledDatePicker;
