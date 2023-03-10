import { useMemo } from 'react';
import { Paper, Typography } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  TableFormFieldColumnAnswer,
  NumberFormFieldAnswer,
} from '@indocal/services';

export interface NumberColumnAnswerProps {
  answer: TableFormFieldColumnAnswer;
}

export const NumberColumnAnswer: React.FC<NumberColumnAnswerProps> = ({
  answer,
}) => {
  const content = useMemo(
    () => answer.content as NumberFormFieldAnswer | null,
    [answer]
  );

  return (
    <Paper elevation={5} sx={{ padding: (theme) => theme.spacing(1) }}>
      {typeof content === 'number' ? (
        <Typography>{content}</Typography>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Paper>
  );
};

export default NumberColumnAnswer;
