import { useMemo } from 'react';
import { Box, Paper, Stack, Divider, Typography, Chip } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  translateFormFieldType,
  FormFieldAnswer,
  SignatureFormFieldAnswer,
} from '@indocal/services';

export interface SignatureAnswerProps {
  answer: FormFieldAnswer;
}

export const SignatureAnswer: React.FC<SignatureAnswerProps> = ({ answer }) => {
  const content = useMemo(
    () => answer.content as SignatureFormFieldAnswer | null,
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
              color="Signature.secondary"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {answer.field.description}
            </Typography>
          )}
        </Stack>

        <Chip label={translateFormFieldType(answer.field.type)} />
      </Stack>

      {content ? (
        <Box
          component="img"
          src={content}
          sx={{
            width: '100%',
            height: 200,
            objectFit: 'contain',
            objectPosition: 'center',
          }}
        />
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Stack>
  );
};

export default SignatureAnswer;
