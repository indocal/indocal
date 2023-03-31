import { useMemo } from 'react';
import { Paper, Stack, Divider, Typography, Chip, Rating } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  translateFormFieldType,
  SectionFormFieldItemAnswer,
  RatingFormFieldAnswer,
  RatingFormFieldConfig,
} from '@indocal/services';

export interface RatingItemAnswerProps {
  answer: SectionFormFieldItemAnswer;
}

export const RatingItemAnswer: React.FC<RatingItemAnswerProps> = ({
  answer,
}) => {
  const config = useMemo(
    () => answer.item.config as RatingFormFieldConfig | null,
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
          <Typography variant="h6">{answer.item.title}</Typography>

          {answer.item.description && (
            <Typography
              component="pre"
              variant="caption"
              color="text.secondary"
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

      {typeof content === 'number' ? (
        <Rating readOnly max={config?.levels} defaultValue={content} />
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Stack>
  );
};

export default RatingItemAnswer;
