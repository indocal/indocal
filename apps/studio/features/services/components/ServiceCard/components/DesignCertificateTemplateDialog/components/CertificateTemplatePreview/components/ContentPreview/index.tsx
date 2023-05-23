import { Html } from 'react-pdf-html';
import { useFormContext } from 'react-hook-form';

export const ContentPreview: React.FC = () => {
  const { watch } = useFormContext();

  const content = watch('content');

  if (!content) return null;

  return <Html>{content}</Html>;
};

export default ContentPreview;
