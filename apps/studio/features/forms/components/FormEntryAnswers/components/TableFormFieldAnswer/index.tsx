import { FormFieldAnswer } from '@/features';

export interface TableFormFieldAnswerProps {
  answer: FormFieldAnswer;
}

export const TableFormFieldAnswer: React.FC<TableFormFieldAnswerProps> = ({
  answer,
}) => (
  <pre>{answer.content ? JSON.stringify(answer.content, null, 2) : 'N/A'}</pre>
);

export default TableFormFieldAnswer;
