import { Paper } from '@mui/material';

import { FormFieldAnswer } from '@indocal/services';

export interface TableAnswerProps {
  answer: FormFieldAnswer;
}

export const TableAnswer: React.FC<TableAnswerProps> = ({ answer }) => (
  <Paper sx={{ padding: (theme) => theme.spacing(2) }}>
    {JSON.stringify(answer.content, null, 2)}
  </Paper>
);

export default TableAnswer;
