import { useMemo } from 'react';
import { Typography } from '@mui/material';

import {
  FormFieldAnswer,
  EmailFormFieldAnswer as EmailAnswer,
} from '@indocal/services';

export interface EmailFormFieldAnswerProps {
  answer: FormFieldAnswer;
}

export const EmailFormFieldAnswer: React.FC<EmailFormFieldAnswerProps> = ({
  answer,
}) => {
  const content = useMemo<EmailAnswer | null>(
    () => (answer.content as EmailAnswer) ?? null,
    [answer.content]
  );

  return (
    <>
      <Typography variant="h6">{answer.field.title}</Typography>
      <Typography>{content || 'N/A'}</Typography>
    </>
  );
};

export default EmailFormFieldAnswer;
