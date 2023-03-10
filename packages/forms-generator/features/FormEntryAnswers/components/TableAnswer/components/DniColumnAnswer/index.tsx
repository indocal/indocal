import { useMemo } from 'react';
import { Paper, Typography } from '@mui/material';

import { NoData, formatDni } from '@indocal/ui';
import {
  TableFormFieldColumnAnswer,
  DniFormFieldAnswer,
} from '@indocal/services';

export interface DniColumnAnswerProps {
  answer: TableFormFieldColumnAnswer;
}

export const DniColumnAnswer: React.FC<DniColumnAnswerProps> = ({ answer }) => {
  const content = useMemo(
    () => answer.content as DniFormFieldAnswer | null,
    [answer]
  );

  return (
    <Paper elevation={5} sx={{ padding: (theme) => theme.spacing(1) }}>
      {content ? (
        <Typography>{formatDni(content, 'UI')}</Typography>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Paper>
  );
};

export default DniColumnAnswer;
