import { useMemo } from 'react';
import { Paper, Stack, Divider, Typography, Chip } from '@mui/material';

import { NoData, formatDni } from '@indocal/ui';
import {
  translateFormFieldType,
  SectionFormFieldItemAnswer,
  DniFormFieldAnswer,
} from '@indocal/services';

export interface DniItemAnswerProps {
  answer: SectionFormFieldItemAnswer;
}

export const DniItemAnswer: React.FC<DniItemAnswerProps> = ({ answer }) => {
  const content = useMemo(
    () => answer.content as DniFormFieldAnswer | null,
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
            >
              {answer.item.description}
            </Typography>
          )}
        </Stack>

        <Chip label={translateFormFieldType(answer.item.type)} />
      </Stack>

      {content ? (
        <Typography>{formatDni(content, 'UI')}</Typography>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Stack>
  );
};

export default DniItemAnswer;
