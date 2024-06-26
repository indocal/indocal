import { TextFieldProps } from '@mui/material';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers';
import { Controller, ControllerProps, Control } from 'react-hook-form';

export interface ControlledTimePickerProps {
  name: string;
  label?: string;
  description?: string | null;
  control: Control;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  timePickerProps?: Omit<TimePickerProps<Date>, 'label' | 'value' | 'onChange'>;
  textFieldProps?: Omit<TextFieldProps, 'error' | 'helperText'>;
}

export const ControlledTimePicker: React.FC<ControlledTimePickerProps> = ({
  name,
  label,
  description,
  control,
  controllerProps,
  timePickerProps,
  textFieldProps,
}) => (
  <Controller
    {...controllerProps}
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <TimePicker
        {...timePickerProps}
        label={label}
        value={value ?? null}
        onChange={(value) => onChange(value)}
        slotProps={{
          textField: {
            ...textFieldProps,
            error: Boolean(error),
            helperText: error?.message || description,
          },
        }}
      />
    )}
  />
);

export default ControlledTimePicker;
