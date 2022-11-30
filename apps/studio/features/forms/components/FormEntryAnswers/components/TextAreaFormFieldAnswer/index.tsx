import { useMemo } from 'react';
import { Typography } from '@mui/material';

import {
  FormFieldAnswer,
  TextAreaFormFieldAnswer as TextAreaAnswer,
} from '@/features';

export interface TextAreaFormFieldAnswerProps {
  answer: FormFieldAnswer;
}

export const TextAreaFormFieldAnswer: React.FC<
  TextAreaFormFieldAnswerProps
> = ({ answer }) => {
  const content = useMemo<TextAreaAnswer | null>(
    () => (answer.content as TextAreaAnswer) ?? null,
    [answer.content]
  );

  return (
    <>
      <Typography variant="h6">{answer.field.title}</Typography>

      <Typography
        component="pre"
        sx={{ whiteSpace: 'break-spaces', wordBreak: 'break-word' }}
      >
        {content || 'N/A'}
      </Typography>
    </>
  );
};

export default TextAreaFormFieldAnswer;
