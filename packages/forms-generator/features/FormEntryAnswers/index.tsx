import { FormEntry } from '@indocal/services';

export interface FormEntryAnswersProps {
  entry: FormEntry;
}

export const FormEntryAnswers: React.FC<FormEntryAnswersProps> = ({
  entry,
}) => {
  return (
    <>
      {entry.answers.map((answer) => (
        <pre key={answer.field.id}>
          {JSON.stringify(answer.content, null, 2)}
        </pre>
      ))}
    </>
  );
};

export default FormEntryAnswers;
