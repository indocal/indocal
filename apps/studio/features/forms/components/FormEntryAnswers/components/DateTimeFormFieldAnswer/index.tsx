import { FormFieldAnswer } from '@indocal/services';

export interface DateTimeFormFieldAnswerProps {
  answer: FormFieldAnswer;
}

export const DateTimeFormFieldAnswer: React.FC<
  DateTimeFormFieldAnswerProps
> = ({ answer }) => (
  <pre>{answer.content ? JSON.stringify(answer.content, null, 2) : 'N/A'}</pre>
);

export default DateTimeFormFieldAnswer;
