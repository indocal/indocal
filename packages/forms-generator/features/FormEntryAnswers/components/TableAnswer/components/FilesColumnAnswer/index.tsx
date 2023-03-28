import { useMemo } from 'react';
import { Paper } from '@mui/material';

import { NoData } from '@indocal/ui';
import {
  TableFormFieldColumnAnswer,
  FilesFormFieldAnswer,
} from '@indocal/services';

import { SingleFile, MultipleFiles } from './components';

export interface FilesColumnAnswerProps {
  answer: TableFormFieldColumnAnswer;
}

export const FilesColumnAnswer: React.FC<FilesColumnAnswerProps> = ({
  answer,
}) => {
  const content = useMemo(
    () => answer.content as FilesFormFieldAnswer | null,
    [answer]
  );

  return (
    <Paper elevation={5} sx={{ padding: (theme) => theme.spacing(1) }}>
      {!content || content.length === 0 ? (
        <NoData message="Campo no respondido" />
      ) : typeof content === 'string' ? (
        <SingleFile file={content} />
      ) : (
        <MultipleFiles files={content} />
      )}
    </Paper>
  );
};

export default FilesColumnAnswer;
