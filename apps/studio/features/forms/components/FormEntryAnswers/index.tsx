import { FormEntry } from '@indocal/services';

export interface FormEntryAnswersProps {
  entry: FormEntry;
}

export const FormEntryAnswers: React.FC<FormEntryAnswersProps> = ({
  entry,
}) => <pre>{JSON.stringify(entry, null, 2)}</pre>;

export default FormEntryAnswers;
