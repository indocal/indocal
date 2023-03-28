import { useMemo } from 'react';
import { Paper, Stack, Divider, Typography, Chip, Rating } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  translateFormFieldType,
  FormFieldAnswer,
  RatingFormFieldAnswer,
  RatingFormFieldConfig,
} from '@indocal/services';

export interface RatingAnswerProps {
  answer: FormFieldAnswer;
}

export const RatingAnswer: React.FC<RatingAnswerProps> = ({ answer }) => {
  const config = useMemo(
    () => answer.field.config as RatingFormFieldConfig | null,
    [answer]
  );

  const content = useMemo(
    () => answer.content as RatingFormFieldAnswer | null,
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
        <Rating readOnly max={config?.levels} defaultValue={content} />
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Stack>
  );
};

export default RatingAnswer;
