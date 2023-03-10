import { useMemo } from 'react';
import { Paper, Typography } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  TableFormFieldColumnAnswer,
  DateTimeFormFieldAnswer,
} from '@indocal/services';

export interface DateTimeColumnAnswerProps {
  answer: TableFormFieldColumnAnswer;
}

export const DateTimeColumnAnswer: React.FC<DateTimeColumnAnswerProps> = ({
  answer,
}) => {
  const content = useMemo(
    () => answer.content as DateTimeFormFieldAnswer | null,
    [answer]
  );

  return (
    <Paper elevation={5} sx={{ padding: (theme) => theme.spacing(1) }}>
      {content ? (
        <Typography>{new Date(content).toLocaleString()}</Typography>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Paper>
  );
};

export default DateTimeColumnAnswer;
