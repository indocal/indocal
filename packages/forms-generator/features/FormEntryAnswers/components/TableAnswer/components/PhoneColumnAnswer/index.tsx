import { useMemo } from 'react';
import { Paper, Stack, Typography, IconButton } from '@mui/material';
import { Phone as PhoneIcon } from '@mui/icons-material';

import { NoData, formatPhone } from '@indocal/ui';
import {
  TableFormFieldColumnAnswer,
  PhoneFormFieldAnswer,
} from '@indocal/services';

export interface PhoneColumnAnswerProps {
  answer: TableFormFieldColumnAnswer;
}

export const PhoneColumnAnswer: React.FC<PhoneColumnAnswerProps> = ({
  answer,
}) => {
  const content = useMemo(
    () => answer.content as PhoneFormFieldAnswer | null,
    [answer]
  );

  return (
    <Paper elevation={5} sx={{ padding: (theme) => theme.spacing(0.5) }}>
      {content ? (
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          <IconButton href={`tel:${content}`}>
            <PhoneIcon />
          </IconButton>

          <Typography>{formatPhone(content, 'UI')}</Typography>
        </Stack>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Paper>
  );
};

export default PhoneColumnAnswer;
