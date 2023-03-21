import { TextFieldProps } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { Controller, ControllerProps, Control } from 'react-hook-form';

export interface ControlledDatePickerProps {
  name: string;
  label?: string;
  description?: string | null;
  control: Control;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  datePickerProps?: Omit<
    DatePickerProps<Date>,
    'label' | 'value' | 'onChange' | 'renderInput'
  >;
  textFieldProps?: Omit<TextFieldProps, 'error' | 'helperText'>;
}

export const ControlledDatePicker: React.FC<ControlledDatePickerProps> = ({
  name,
  label,
  description,
  control,
  controllerProps,
  datePickerProps,
  textFieldProps,
}) => (
  <Controller
    {...controllerProps}
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <DatePicker
        {...datePickerProps}
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

export default ControlledDatePicker;
