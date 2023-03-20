import { useMemo } from 'react';
import { Paper, Stack, FormControlLabel, Radio } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  TableFormFieldColumnAnswer,
  RadioFormFieldAnswer,
} from '@indocal/services';

export interface RadioColumnAnswerProps {
  answer: TableFormFieldColumnAnswer;
}

export const RadioColumnAnswer: React.FC<RadioColumnAnswerProps> = ({
  answer,
}) => {
  const content = useMemo(
    () => answer.content as RadioFormFieldAnswer | null,
    [answer]
  );

  return (
    <Paper elevation={5} sx={{ paddingX: (theme) => theme.spacing(1) }}>
      {content ? (
        <Stack spacing={1}>
          <FormControlLabel
            label={content}
            control={<Radio disableRipple checked={Boolean(content)} />}
          />
        </Stack>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Paper>
  );
};

export default RadioColumnAnswer;
