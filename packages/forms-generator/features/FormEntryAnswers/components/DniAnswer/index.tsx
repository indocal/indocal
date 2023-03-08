import { useMemo } from 'react';
import { Paper, Stack, Divider, Typography, Chip } from '@mui/material';

import { NoData, formatDni } from '@indocal/ui';
import {
  translateFormFieldType,
  FormFieldAnswer,
  DniFormFieldAnswer,
} from '@indocal/services';

export interface DniAnswerProps {
  answer: FormFieldAnswer;
}

export const DniAnswer: React.FC<DniAnswerProps> = ({ answer }) => {
  const content = useMemo(
    () => answer.content as DniFormFieldAnswer | null,
    [answer]
  );

  return (
    <Stack
      component={Paper}
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
          <Typography variant="h6">{answer.field.title}</Typography>

          {answer.field.description && (
            <Typography
              component="pre"
              variant="caption"
              color="text.secondary"
            >
              {answer.field.description}
            </Typography>
          )}
        </Stack>

        <Chip label={translateFormFieldType(answer.field.type)} />
      </Stack>

      {content ? (
        <Typography>{formatDni(content, 'UI')}</Typography>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Stack>
  );
};

export default DniAnswer;
