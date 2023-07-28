import { useMemo } from 'react';
import { Box, Paper, Stack, Divider, Typography, Chip } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  translateFormFieldType,
  SectionFormFieldItemAnswer,
  SignatureFormFieldAnswer,
} from '@indocal/services';

export interface SignatureItemAnswerProps {
  answer: SectionFormFieldItemAnswer;
}

export const SignatureItemAnswer: React.FC<SignatureItemAnswerProps> = ({
  answer,
}) => {
  const content = useMemo(
    () => answer.content as SignatureFormFieldAnswer | null,
    [answer]
  );

  return (
    <Stack
      component={Paper}
      elevation={4}
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
          <Typography variant="h6">{answer.item.title}</Typography>

          {answer.item.description && (
            <Typography
              component="pre"
              variant="caption"
              color="Signature.secondary"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {answer.item.description}
            </Typography>
          )}
        </Stack>

        <Chip label={translateFormFieldType(answer.item.type)} />
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

export default SignatureItemAnswer;
