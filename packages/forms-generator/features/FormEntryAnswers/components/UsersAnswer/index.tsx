import { useMemo } from 'react';
import { Paper, Stack, Divider, Typography, Chip } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  translateFormFieldType,
  FormFieldAnswer,
  UsersFormFieldAnswer,
} from '@indocal/services';

import { SingleUser, MultipleUsers } from './components';

export interface UsersAnswerProps {
  answer: FormFieldAnswer;
}

export const UsersAnswer: React.FC<UsersAnswerProps> = ({ answer }) => {
  const content = useMemo(
    () => answer.content as UsersFormFieldAnswer | null,
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

export default UsersAnswer;
