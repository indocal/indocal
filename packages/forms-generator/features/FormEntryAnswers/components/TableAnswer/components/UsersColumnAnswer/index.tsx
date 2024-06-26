import { useMemo } from 'react';
import { Paper } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  TableFormFieldColumnAnswer,
  UsersFormFieldAnswer,
} from '@indocal/services';

import { SingleUser, MultipleUsers } from './components';

export interface UsersColumnAnswerProps {
  answer: TableFormFieldColumnAnswer;
}

export const UsersColumnAnswer: React.FC<UsersColumnAnswerProps> = ({
  answer,
}) => {
  const content = useMemo(
    () => answer.content as UsersFormFieldAnswer | null,
    [answer]
  );

  return (
    <Paper elevation={5} sx={{ padding: (theme) => theme.spacing(1) }}>
      {!content || content.length === 0 ? (
        <NoData message="Campo no respondido" />
      ) : typeof content === 'string' ? (
        <SingleUser user={content} />
      ) : (
        <MultipleUsers users={content} />
      )}
    </Paper>
  );
};

export default UsersColumnAnswer;
