import { useMemo } from 'react';
import { Typography } from '@mui/material';

import {
  FormFieldAnswer,
  NumberFormFieldAnswer as NumberAnswer,
} from '@/features';

export interface NumberFormFieldAnswerProps {
  answer: FormFieldAnswer;
}

export const NumberFormFieldAnswer: React.FC<NumberFormFieldAnswerProps> = ({
  answer,
}) => {
  const content = useMemo<NumberAnswer | null>(
    () => (answer.content as NumberAnswer) ?? null,
    [answer.content]
  );

  return (
    <>
      <Typography variant="h6">{answer.field.title}</Typography>
      <Typography>{content ?? 'N/A'}</Typography>
    </>
  );
};

export default NumberFormFieldAnswer;
