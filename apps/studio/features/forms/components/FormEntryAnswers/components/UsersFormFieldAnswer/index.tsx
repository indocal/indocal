import { FormFieldAnswer } from '@/features';

export interface UsersFormFieldAnswerProps {
  answer: FormFieldAnswer;
}

export const UsersFormFieldAnswer: React.FC<UsersFormFieldAnswerProps> = ({
  answer,
}) => (
  <pre>{answer.content ? JSON.stringify(answer.content, null, 2) : 'N/A'}</pre>
);

export default UsersFormFieldAnswer;
