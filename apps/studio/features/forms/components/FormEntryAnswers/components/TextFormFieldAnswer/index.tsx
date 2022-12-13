import { useMemo } from 'react';
import { Typography } from '@mui/material';

import {
  FormFieldAnswer,
  TextFormFieldAnswer as TextAnswer,
} from '@indocal/services';

export interface TextFormFieldAnswerProps {
  answer: FormFieldAnswer;
}

export const TextFormFieldAnswer: React.FC<TextFormFieldAnswerProps> = ({
  answer,
}) => {
  const content = useMemo<TextAnswer | null>(
    () => (answer.content as TextAnswer) ?? null,
    [answer.content]
  );

  return (
    <>
      <Typography variant="h6">{answer.field.title}</Typography>
      <Typography>{content || 'N/A'}</Typography>
    </>
  );
};

export default TextFormFieldAnswer;
