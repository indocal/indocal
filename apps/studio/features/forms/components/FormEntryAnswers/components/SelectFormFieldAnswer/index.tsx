import { useMemo } from 'react';
import { Typography, Chip } from '@mui/material';

import {
  FormFieldAnswer,
  SelectFormFieldAnswer as SelectAnswer,
} from '@indocal/services';

export interface SelectFormFieldAnswerProps {
  answer: FormFieldAnswer;
}

export const SelectFormFieldAnswer: React.FC<SelectFormFieldAnswerProps> = ({
  answer,
}) => {
  const content = useMemo<SelectAnswer | null>(
    () => (answer.content as SelectAnswer) ?? null,
    [answer.content]
  );

  return (
    <>
      <Typography variant="h6">{answer.field.title}</Typography>

      <Typography>
        {content
          ? typeof content === 'string'
            ? content
            : content.map((option) => <Chip key={option} label={option} />)
          : 'N/A'}
      </Typography>
    </>
  );
};

export default SelectFormFieldAnswer;
