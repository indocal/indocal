import { useMemo } from 'react';
import { Paper, Stack, Divider, Typography, Chip } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  translateFormFieldType,
  SectionFormFieldItemAnswer,
  FilesFormFieldAnswer,
} from '@indocal/services';

import { SingleFile, MultipleFiles } from './components';

export interface FilesItemAnswerProps {
  answer: SectionFormFieldItemAnswer;
}

export const FilesItemAnswer: React.FC<FilesItemAnswerProps> = ({ answer }) => {
  const content = useMemo(
    () => answer.content as FilesFormFieldAnswer | null,
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
        typeof content === 'string' ? (
          <SingleFile file={content} />
        ) : (
          <MultipleFiles files={content} />
        )
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Stack>
  );
};

export default FilesItemAnswer;
