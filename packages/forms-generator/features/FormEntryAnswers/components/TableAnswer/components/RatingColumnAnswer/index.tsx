import { useMemo } from 'react';
import { Paper, Stack, Divider, Typography, Chip, Rating } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  translateFormFieldType,
  TableFormFieldColumnAnswer,
  RatingFormFieldAnswer,
  RatingFormFieldConfig,
} from '@indocal/services';

export interface RatingColumnAnswerProps {
  answer: TableFormFieldColumnAnswer;
}

export const RatingColumnAnswer: React.FC<RatingColumnAnswerProps> = ({
  answer,
}) => {
  const config = useMemo(
    () => answer.column.config as RatingFormFieldConfig | null,
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
          <Typography variant="h6">{answer.column.heading}</Typography>
        </Stack>

        <Chip label={translateFormFieldType(answer.column.type)} />
      </Stack>

      {typeof content === 'number' ? (
        <Rating readOnly max={config?.levels} defaultValue={content} />
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Stack>
  );
};

export default RatingColumnAnswer;
