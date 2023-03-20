import { useMemo } from 'react';
import { Paper, FormControlLabel, Checkbox } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  TableFormFieldColumnAnswer,
  CheckboxFormFieldAnswer,
} from '@indocal/services';

export interface CheckboxColumnAnswerProps {
  answer: TableFormFieldColumnAnswer;
}

export const CheckboxColumnAnswer: React.FC<CheckboxColumnAnswerProps> = ({
  answer,
}) => {
  const content = useMemo(
    () => answer.content as CheckboxFormFieldAnswer | null,
    [answer]
  );

  return (
    <Paper elevation={5}>
      {typeof content === 'boolean' ? (
        <FormControlLabel
          label={content ? 'Sí' : 'No'}
          control={<Checkbox disableRipple checked={content} />}
        />
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Paper>
  );
};

export default CheckboxColumnAnswer;
