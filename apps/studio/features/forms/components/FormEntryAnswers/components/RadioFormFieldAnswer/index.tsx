import { FormFieldAnswer } from '@/features';

export interface RadioFormFieldAnswerProps {
  answer: FormFieldAnswer;
}

export const RadioFormFieldAnswer: React.FC<RadioFormFieldAnswerProps> = ({
  answer,
}) => (
  <pre>{answer.content ? JSON.stringify(answer.content, null, 2) : 'N/A'}</pre>
);

export default RadioFormFieldAnswer;
