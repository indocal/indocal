import { useMemo } from 'react';
import {
  Paper,
  Stack,
  Divider,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import { Phone as PhoneIcon } from '@mui/icons-material';

import { NoData, formatPhone } from '@indocal/ui';
import {
  translateFormFieldType,
  SectionFormFieldItemAnswer,
  PhoneFormFieldAnswer,
} from '@indocal/services';

export interface PhoneItemAnswerProps {
  answer: SectionFormFieldItemAnswer;
}

export const PhoneItemAnswer: React.FC<PhoneItemAnswerProps> = ({ answer }) => {
  const content = useMemo(
    () => answer.content as PhoneFormFieldAnswer | null,
    [answer]
  );

  return (
    <Stack
      component={Paper}
      elevation={4}
      spacing={1}
      divider={<Divider flexItem />}
      sx={{ padding: (theme) => theme.spacing(2) }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={1}
      >
        <Stack>
          <Typography variant="h6">{answer.item.title}</Typography>

          {answer.item.description && (
            <Typography
              component="pre"
              variant="caption"
              color="text.secondary"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {answer.item.description}
            </Typography>
          )}
        </Stack>

        <Chip label={translateFormFieldType(answer.item.type)} />
      </Stack>

      {content ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={1}
        >
          <Typography>{formatPhone(content, 'UI')}</Typography>

          <IconButton href={`tel:${content}`}>
            <PhoneIcon />
          </IconButton>
        </Stack>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Stack>
  );
};

export default PhoneItemAnswer;
