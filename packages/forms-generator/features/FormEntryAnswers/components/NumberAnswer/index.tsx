import { useMemo } from 'react';
import { Paper, Stack, Divider, Typography, Chip } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  translateFormFieldType,
  FormFieldAnswer,
  NumberFormFieldAnswer,
} from '@indocal/services';

export interface NumberAnswerProps {
  answer: FormFieldAnswer;
}

export const NumberAnswer: React.FC<NumberAnswerProps> = ({ answer }) => {
  const content = useMemo(
    () => answer.content as NumberFormFieldAnswer | null,
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

      {typeof content === 'number' ? (
        <Typography>{content}</Typography>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Stack>
  );
};

export default NumberAnswer;
