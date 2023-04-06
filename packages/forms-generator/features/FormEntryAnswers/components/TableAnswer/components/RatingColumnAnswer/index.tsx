import { useMemo } from 'react';
import { Paper, Rating } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
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
    <Paper elevation={5} sx={{ padding: (theme) => theme.spacing(1) }}>
      {typeof content === 'number' ? (
        <Rating readOnly max={config?.levels} defaultValue={content} />
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Paper>
  );
};

export default RatingColumnAnswer;
