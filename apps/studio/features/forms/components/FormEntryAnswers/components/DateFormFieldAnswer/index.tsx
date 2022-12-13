import { FormFieldAnswer } from '@indocal/services';

export interface DateFormFieldAnswerProps {
  answer: FormFieldAnswer;
}

export const DateFormFieldAnswer: React.FC<DateFormFieldAnswerProps> = ({
  answer,
}) => (
  <pre>{answer.content ? JSON.stringify(answer.content, null, 2) : 'N/A'}</pre>
);

export default DateFormFieldAnswer;
