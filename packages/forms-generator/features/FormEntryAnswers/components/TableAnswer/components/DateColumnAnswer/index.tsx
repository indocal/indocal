import { useMemo } from 'react';
import { Paper, Typography } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  TableFormFieldColumnAnswer,
  DateFormFieldAnswer,
} from '@indocal/services';

export interface DateColumnAnswerProps {
  answer: TableFormFieldColumnAnswer;
}

export const DateColumnAnswer: React.FC<DateColumnAnswerProps> = ({
  answer,
}) => {
  const content = useMemo(
    () => answer.content as DateFormFieldAnswer | null,
    [answer]
  );

  return (
    <Paper elevation={5} sx={{ padding: (theme) => theme.spacing(1) }}>
      {content ? (
        <Typography>{new Date(content).toLocaleDateString()}</Typography>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Paper>
  );
};

export default DateColumnAnswer;
