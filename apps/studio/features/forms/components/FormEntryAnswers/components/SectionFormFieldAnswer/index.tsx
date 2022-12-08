import { FormFieldAnswer } from '@/features';

export interface SectionFormFieldAnswerProps {
  answer: FormFieldAnswer;
}

export const SectionFormFieldAnswer: React.FC<SectionFormFieldAnswerProps> = ({
  answer,
}) => (
  <pre>{answer.content ? JSON.stringify(answer.content, null, 2) : 'N/A'}</pre>
);

export default SectionFormFieldAnswer;
