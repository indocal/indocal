import { useMemo } from 'react';
import {
  Paper,
  Stack,
  Divider,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import { Mail as MailIcon } from '@mui/icons-material';

import { NoData } from '@indocal/ui';
import {
  translateFormFieldType,
  FormFieldAnswer,
  EmailFormFieldAnswer,
} from '@indocal/services';

export interface EmailAnswerProps {
  answer: FormFieldAnswer;
}

export const EmailAnswer: React.FC<EmailAnswerProps> = ({ answer }) => {
  const content = useMemo(
    () => answer.content as EmailFormFieldAnswer | null,
    [answer]
  );

  return (
    <Stack
      component={Paper}
      spacing={1}
      divider={<Divider flexItem />}
      sx={{ padding: (theme) => theme.spacing(2) }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={1}
      >
        <Stack>
          <Typography variant="h6">{answer.field.title}</Typography>

          {answer.field.description && (
            <Typography
              component="pre"
              variant="caption"
              color="text.secondary"
            >
              {answer.field.description}
            </Typography>
          )}
        </Stack>

        <Chip label={translateFormFieldType(answer.field.type)} />
      </Stack>

      {content ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={1}
        >
          <Typography>{content}</Typography>

          <IconButton href={`mailto:${content}`}>
            <MailIcon />
          </IconButton>
        </Stack>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Stack>
  );
};

export default EmailAnswer;
