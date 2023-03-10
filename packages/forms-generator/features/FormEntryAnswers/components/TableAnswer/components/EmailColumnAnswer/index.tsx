import { useMemo } from 'react';
import { Paper, Stack, Typography, IconButton } from '@mui/material';
import { Mail as MailIcon } from '@mui/icons-material';

import { NoData } from '@indocal/ui';
import {
  TableFormFieldColumnAnswer,
  EmailFormFieldAnswer,
} from '@indocal/services';

export interface EmailColumnAnswerProps {
  answer: TableFormFieldColumnAnswer;
}

export const EmailColumnAnswer: React.FC<EmailColumnAnswerProps> = ({
  answer,
}) => {
  const content = useMemo(
    () => answer.content as EmailFormFieldAnswer | null,
    [answer]
  );

  return (
    <Paper elevation={5} sx={{ padding: (theme) => theme.spacing(1) }}>
      {content ? (
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          <IconButton href={`mailto:${content}`}>
            <MailIcon />
          </IconButton>

          <Typography>{content}</Typography>
        </Stack>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Paper>
  );
};

export default EmailColumnAnswer;
