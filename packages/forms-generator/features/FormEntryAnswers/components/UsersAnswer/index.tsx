import { Paper } from '@mui/material';

import { FormFieldAnswer } from '@indocal/services';

export interface UsersAnswerProps {
  answer: FormFieldAnswer;
}

export const UsersAnswer: React.FC<UsersAnswerProps> = ({ answer }) => (
  <Paper sx={{ padding: (theme) => theme.spacing(2) }}>
    {JSON.stringify(answer.content, null, 2)}
  </Paper>
);

export default UsersAnswer;
