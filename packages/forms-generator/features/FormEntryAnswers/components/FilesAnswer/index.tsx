import { Paper } from '@mui/material';

import { FormFieldAnswer } from '@indocal/services';

export interface FilesAnswerProps {
  answer: FormFieldAnswer;
}

export const FilesAnswer: React.FC<FilesAnswerProps> = ({ answer }) => (
  <Paper sx={{ padding: (theme) => theme.spacing(2) }}>
    {JSON.stringify(answer.content, null, 2)}
  </Paper>
);

export default FilesAnswer;
