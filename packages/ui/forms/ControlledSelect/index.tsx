import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  FormControlProps,
  FormHelperTextProps,
  InputLabelProps,
  SelectProps,
} from '@mui/material';
import { Controller, ControllerProps, Control } from 'react-hook-form';

export interface ControlledSelectProps {
  name: string;
  label: string;
  control: Control;
  controllerProps?: Omit<ControllerProps, 'name' | 'render'>;
  formControlProps?: FormControlProps;
  formHelperTextProps?: FormHelperTextProps;
  inputLabelProps?: InputLabelProps;
  selectProps?: SelectProps;
}

export const ControlledSelect: React.FC<
  React.PropsWithChildren<ControlledSelectProps>
> = ({
  name,
  label,
  control,
  controllerProps,
  formControlProps,
  formHelperTextProps,
  inputLabelProps,
  selectProps,
  children,
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <FormControl error={Boolean(error)} {...formControlProps}>
        <InputLabel {...inputLabelProps}>{label}</InputLabel>

        <Select
          label={label}
          value={value}
          onChange={(value) => onChange(value)}
          {...selectProps}
        >
          {children}
        </Select>

        <FormHelperText {...formHelperTextProps}>
          {error?.message}
        </FormHelperText>
      </FormControl>
    )}
    {...controllerProps}
  />
);

export default ControlledSelect;
