import { useMemo } from 'react';
import { Paper, Typography } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  TableFormFieldColumnAnswer,
  TextAreaFormFieldAnswer,
} from '@indocal/services';

export interface TextAreaColumnAnswerProps {
  answer: TableFormFieldColumnAnswer;
}

export const TextAreaColumnAnswer: React.FC<TextAreaColumnAnswerProps> = ({
  answer,
}) => {
  const content = useMemo(
    () => answer.content as TextAreaFormFieldAnswer | null,
    [answer]
  );

  return (
    <Paper elevation={5} sx={{ padding: (theme) => theme.spacing(1) }}>
      {content ? (
        <Typography
          component="pre"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {content}
        </Typography>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Paper>
  );
};

export default TextAreaColumnAnswer;
