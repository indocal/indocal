import { useMemo } from 'react';
import { Paper, Stack, Divider, Typography, Chip } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  translateFormFieldType,
  SectionFormFieldItemAnswer,
  UsersFormFieldAnswer,
} from '@indocal/services';

import { SingleUser, MultipleUsers } from './components';

export interface UsersItemAnswerProps {
  answer: SectionFormFieldItemAnswer;
}

export const UsersItemAnswer: React.FC<UsersItemAnswerProps> = ({ answer }) => {
  const content = useMemo(
    () => answer.content as UsersFormFieldAnswer | null,
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
          <SingleUser user={content} />
        ) : (
          <MultipleUsers users={content} />
        )
      ) : (
        <NoData message="Campo no respondido" />
      )}
    </Stack>
  );
};

export default UsersItemAnswer;
