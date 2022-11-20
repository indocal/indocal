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
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  formControlProps?: Omit<FormControlProps, 'error'>;
  formHelperTextProps?: FormHelperTextProps;
  inputLabelProps?: InputLabelProps;
  selectProps?: Omit<SelectProps, 'label' | 'value' | 'onChange'>;
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
    {...controllerProps}
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <FormControl {...formControlProps} error={Boolean(error)}>
        <InputLabel {...inputLabelProps}>{label}</InputLabel>

        <Select
          {...selectProps}
          label={label}
          value={value}
          onChange={(value) => onChange(value)}
        >
          {children}
        </Select>

        <FormHelperText {...formHelperTextProps}>
          {error?.message}
        </FormHelperText>
      </FormControl>
    )}
  />
);

export default ControlledSelect;
