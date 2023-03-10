import { useMemo } from 'react';
import { Paper, Typography } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  TableFormFieldColumnAnswer,
  TextFormFieldAnswer,
} from '@indocal/services';

export interface TextColumnAnswerProps {
  answer: TableFormFieldColumnAnswer;
}

export const TextColumnAnswer: React.FC<TextColumnAnswerProps> = ({
  answer,
}) => {
  const content = useMemo(
    () => answer.content as TextFormFieldAnswer | null,
    [answer]
  );

  return (
    <Paper elevation={5} sx={{ padding: (theme) => theme.spacing(1) }}>
      {content ? (
        <Typography>{content}</Typography>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Paper>
  );
};

export default TextColumnAnswer;
