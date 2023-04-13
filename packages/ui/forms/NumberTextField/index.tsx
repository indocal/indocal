import { TextField, TextFieldProps } from '@mui/material';

export type NumberTextFieldProps = Omit<TextFieldProps, 'type'>;

export const NumberTextField: React.FC<NumberTextFieldProps> = (props) => (
  <TextField
    {...props}
    type="number"
    inputProps={{
      ...props.inputProps,
      inputMode: 'numeric',
      pattern: '[0-9]*',
    }}
  />
);

export default NumberTextField;
