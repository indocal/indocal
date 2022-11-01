import { TextField, TextFieldProps } from '@mui/material';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers';
import { Controller, ControllerProps, Control } from 'react-hook-form';

export interface ControlledTimePickerProps {
  name: string;
  label: string;
  control: Control;
  controllerProps?: Omit<ControllerProps, 'name' | 'render'>;
  timePickerProps?: TimePickerProps<Date, Date>;
  textFieldProps?: TextFieldProps;
}

export const ControlledTimePicker: React.FC<ControlledTimePickerProps> = ({
  name,
  label,
  control,
  controllerProps,
  timePickerProps,
  textFieldProps,
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <TimePicker
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
        {...timePickerProps}
      />
    )}
    {...controllerProps}
  />
);

export default ControlledTimePicker;
