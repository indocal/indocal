import { useMemo } from 'react';
import { Box, Paper } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  TableFormFieldColumnAnswer,
  SignatureFormFieldAnswer,
} from '@indocal/services';

export interface SignatureColumnAnswerProps {
  answer: TableFormFieldColumnAnswer;
}

export const SignatureColumnAnswer: React.FC<SignatureColumnAnswerProps> = ({
  answer,
}) => {
  const content = useMemo(
    () => answer.content as SignatureFormFieldAnswer | null,
    [answer]
  );

  return (
    <Paper elevation={5} sx={{ padding: (theme) => theme.spacing(1) }}>
      {content ? (
        <Box
          component="img"
          src={content}
          sx={{
            width: '100%',
            height: 100,
            objectFit: 'contain',
            objectPosition: 'center',
          }}
        />
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Paper>
  );
};

export default SignatureColumnAnswer;
