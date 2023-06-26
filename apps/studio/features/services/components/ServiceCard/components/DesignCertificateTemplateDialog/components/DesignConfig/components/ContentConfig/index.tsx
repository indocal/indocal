import {
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';
import { Editor } from '@monaco-editor/react';

import { Loader } from '@indocal/ui';

import { DesignCertificateTemplateDialogData } from '../../../../context';
import { useDebounce } from '../../../../hooks';

export const ContentConfig: React.FC = () => {
  const {
    formState: { errors },
    getValues,
    setValue,
  } = useFormContext<DesignCertificateTemplateDialogData>();

  const [value, onChange] = useDebounce({
    initialValue: getValues('content'),
    debounced: (value) => setValue('content', value, { shouldDirty: true }),
  });

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Contenido</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack
          spacing={1}
          sx={{
            width: '100%',
            ...(errors.content && {
              padding: (theme) => theme.spacing(1.5),
              borderRadius: (theme) => theme.spacing(0.5),
              border: (theme) => `1px solid ${theme.palette.error.main}`,
            }),
          }}
        >
          <Editor
            language="html"
            theme="vs-dark"
            height={275}
            loading={<Loader invisible message="Cargando editor..." />}
            options={{ minimap: { enabled: false } }}
            value={value || ''}
            onChange={(value) => onChange(value || '')}
          />

          {errors.content && (
            <Typography variant="caption" color="error">
              {errors.content.message}
            </Typography>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default ContentConfig;
