import { Paper } from '@mui/material';

import { FormFieldAnswer } from '@indocal/services';

export interface SectionAnswerProps {
  answer: FormFieldAnswer;
}

export const SectionAnswer: React.FC<SectionAnswerProps> = ({ answer }) => (
  <Paper sx={{ padding: (theme) => theme.spacing(2) }}>
    {JSON.stringify(answer.content, null, 2)}
  </Paper>
);

export default SectionAnswer;
