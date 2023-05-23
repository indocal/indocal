import { Paper } from '@mui/material';
import { PDFViewer, Document, Page, StyleSheet } from '@react-pdf/renderer';
import { FormProvider, useFormContext } from 'react-hook-form';

import { Service } from '@indocal/services';

import { BackgroundPreview, QRPreview, ContentPreview } from './components';

export interface CertificateTemplatePreviewProps {
  service: Service;
}

export const CertificateTemplatePreview: React.FC<
  CertificateTemplatePreviewProps
> = ({ service }) => {
  const methods = useFormContext();

  const orientation = methods.watch('layout.orientation');
  const size = methods.watch('layout.size');

  const styles = StyleSheet.create({
    viewer: {
      width: '100%',
      height: '100%',
      border: 'none',
    },
    page: {
      position: 'relative',
    },
  });

  return (
    <Paper
      sx={{
        width: '100%',
        height: '100%',
        padding: (theme) => theme.spacing(2),
      }}
    >
      <PDFViewer style={styles.viewer}>
        <Document title={`Certificado: ${service.title}`}>
          <Page
            size={size}
            orientation={orientation || 'portrait'}
            style={styles.page}
          >
            <FormProvider {...methods}>
              <BackgroundPreview service={service} />
              <QRPreview />
              <ContentPreview />
            </FormProvider>
          </Page>
        </Document>
      </PDFViewer>
    </Paper>
  );
};

export default CertificateTemplatePreview;
