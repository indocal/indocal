import { useMemo } from 'react';
import {
  Paper,
  Stack,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  TableFormFieldColumnAnswer,
  SelectFormFieldAnswer,
} from '@indocal/services';

export interface SelectColumnAnswerProps {
  answer: TableFormFieldColumnAnswer;
}

export const SelectColumnAnswer: React.FC<SelectColumnAnswerProps> = ({
  answer,
}) => {
  const content = useMemo(
    () => answer.content as SelectFormFieldAnswer | null,
    [answer]
  );

  return (
    <Paper elevation={5} sx={{ padding: (theme) => theme.spacing(1) }}>
      {typeof content === 'string' || content?.length ? (
        <Stack spacing={1}>
          {typeof content === 'string' ? (
            <FormControlLabel
              label={content}
              control={<Radio disableRipple checked />}
            />
          ) : (
            <RadioGroup row>
              {content.map((option) => (
                <FormControlLabel
                  key={option}
                  label={option}
                  control={<Radio disableRipple checked />}
                />
              ))}
            </RadioGroup>
          )}
        </Stack>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Paper>
  );
};

export default SelectColumnAnswer;
