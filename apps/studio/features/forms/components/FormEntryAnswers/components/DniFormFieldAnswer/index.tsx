import { useMemo } from 'react';
import { Typography } from '@mui/material';

import { FormFieldAnswer, DniFormFieldAnswer as DniAnswer } from '@/features';

export interface DniFormFieldAnswerProps {
  answer: FormFieldAnswer;
}

export const DniFormFieldAnswer: React.FC<DniFormFieldAnswerProps> = ({
  answer,
}) => {
  const content = useMemo<DniAnswer | null>(
    () => (answer.content as DniAnswer) ?? null,
    [answer.content]
  );

  return (
    <>
      <Typography variant="h6">{answer.field.title}</Typography>
      <Typography>{content || 'N/A'}</Typography>
    </>
  );
};

export default DniFormFieldAnswer;
