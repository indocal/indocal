import { useMemo } from 'react';
import { Typography } from '@mui/material';

import {
  FormFieldAnswer,
  PhoneFormFieldAnswer as PhoneAnswer,
} from '@/features';

export interface PhoneFormFieldAnswerProps {
  answer: FormFieldAnswer;
}

export const PhoneFormFieldAnswer: React.FC<PhoneFormFieldAnswerProps> = ({
  answer,
}) => {
  const content = useMemo<PhoneAnswer | null>(
    () => (answer.content as PhoneAnswer) ?? null,
    [answer.content]
  );

  return (
    <>
      <Typography variant="h6">{answer.field.title}</Typography>
      <Typography>{content || 'N/A'}</Typography>
    </>
  );
};

export default PhoneFormFieldAnswer;
