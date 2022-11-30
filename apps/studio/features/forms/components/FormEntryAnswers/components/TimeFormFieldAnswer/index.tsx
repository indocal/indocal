import { FormFieldAnswer } from '@/features';

export interface TimeFormFieldAnswerProps {
  answer: FormFieldAnswer;
}

export const TimeFormFieldAnswer: React.FC<TimeFormFieldAnswerProps> = ({
  answer,
}) => (
  <pre>{answer.content ? JSON.stringify(answer.content, null, 2) : 'N/A'}</pre>
);

export default TimeFormFieldAnswer;
