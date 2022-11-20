import { useState } from 'react';
import { TextField, IconButton, TextFieldProps } from '@mui/material';
import {
  Visibility as VisibilityOnIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

export type PasswordTextFieldProps = Omit<
  TextFieldProps,
  'type' | 'InputProps'
>;

export const PasswordTextField: React.FC<PasswordTextFieldProps> = (props) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <TextField
      {...props}
      type={show ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <IconButton
            size="small"
            disabled={props.disabled}
            onClick={() => setShow((prevState) => !prevState)}
          >
            {show ? <VisibilityOffIcon /> : <VisibilityOnIcon />}
          </IconButton>
        ),
      }}
    />
  );
};

export default PasswordTextField;
