import { FormFieldAnswer } from '@indocal/services';

export interface CheckboxFormFieldAnswerProps {
  answer: FormFieldAnswer;
}

export const CheckboxFormFieldAnswer: React.FC<
  CheckboxFormFieldAnswerProps
> = ({ answer }) => (
  <pre>{answer.content ? JSON.stringify(answer.content, null, 2) : 'N/A'}</pre>
);

export default CheckboxFormFieldAnswer;
