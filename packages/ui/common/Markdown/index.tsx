import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'github-markdown-css';

export interface MarkdownProps {
  children: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ children }) => (
  <Box
    className="markdown-body"
    sx={{
      width: '100%',
      height: '100%',
      overflow: 'auto',
      marginY: (theme) => theme.spacing(1),
      color: (theme) => `${theme.palette.text.secondary} !important`,
      backgroundColor: 'transparent !important',
    }}
  >
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
  </Box>
);

export default Markdown;
