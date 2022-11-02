import { useMemo } from 'react';
import { MenuItem } from '@mui/material';
import { Control } from 'react-hook-form';

import { ControlledSelect } from '@indocal/ui';
import { FormStatus, translateFormStatus } from '@indocal/services';

export interface ControlledFormStatusSelectProps {
  name: string;
  label: string;
  control: Control;
  disabled?: boolean;
  required?: boolean;
}

export const ControlledFormStatusSelect: React.FC<
  ControlledFormStatusSelectProps
> = ({ name, label, control, disabled, required }) => {
  const status = useMemo<FormStatus[]>(
    () => ['DRAFT', 'PUBLISHED', 'HIDDEN'],
    []
  );

  return (
    <ControlledSelect
      name={name}
      label={label}
      control={control}
      formControlProps={{ required, disabled }}
    >
      {status.map((status) => (
        <MenuItem key={status} value={status}>
          {translateFormStatus(status)}
        </MenuItem>
      ))}
    </ControlledSelect>
  );
};

export default ControlledFormStatusSelect;
