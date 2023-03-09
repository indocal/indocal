import { useMemo } from 'react';
import { Paper, Stack, Divider, Typography, Chip } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  translateFormFieldType,
  SectionFormFieldItemAnswer,
  TextFormFieldAnswer,
} from '@indocal/services';

export interface TextItemAnswerProps {
  answer: SectionFormFieldItemAnswer;
}

export const TextItemAnswer: React.FC<TextItemAnswerProps> = ({ answer }) => {
  const content = useMemo(
    () => answer.content as TextFormFieldAnswer | null,
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
        <Typography>{content}</Typography>
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Stack>
  );
};

export default TextItemAnswer;
