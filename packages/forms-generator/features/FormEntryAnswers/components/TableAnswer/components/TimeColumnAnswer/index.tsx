import { useMemo } from 'react';
import { Paper, Typography } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  TableFormFieldColumnAnswer,
  TimeFormFieldAnswer,
} from '@indocal/services';

export interface TimeColumnAnswerProps {
  answer: TableFormFieldColumnAnswer;
}

export const TimeColumnAnswer: React.FC<TimeColumnAnswerProps> = ({
  answer,
}) => {
  const content = useMemo(
    () => answer.content as TimeFormFieldAnswer | null,
    [answer]
  );

  return (
    <Paper elevation={5} sx={{ padding: (theme) => theme.spacing(1) }}>
      {content ? (
        <Typography>{new Date(content).toLocaleTimeString()}</Typography>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Paper>
  );
};

export default TimeColumnAnswer;
