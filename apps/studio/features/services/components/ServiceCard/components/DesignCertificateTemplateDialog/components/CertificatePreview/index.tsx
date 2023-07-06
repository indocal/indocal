import { PDFViewer, Document, Page, StyleSheet } from '@react-pdf/renderer';
import { Html } from 'react-pdf-html';
import { useFormContext } from 'react-hook-form';

<<<<<<< HEAD
import {
  Service,
  CertificateTemplateLayoutOrientation,
} from '@indocal/services';

import { DesignCertificateTemplateDialogData } from '../../context';
import { highlightPlaceholders } from '../../utils';
=======
import { Service } from '@indocal/services';

import { DesignCertificateTemplateDialogData } from '../../context';
import { CertificateTemplateLayoutOrientation } from '../../types';
>>>>>>> e6eb26b2a75b4c5828ca9ad8a68db06e044ce9bf

const styles = StyleSheet.create({
  viewer: {
    width: '100%',
    height: '100%',
    border: 0,
  },
  page: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
});

export interface CertificatePreviewProps {
  service: Service;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  service,
}) => {
  const { watch } = useFormContext<DesignCertificateTemplateDialogData>();

  const orientation =
    watch('layout.orientation') ||
    CertificateTemplateLayoutOrientation.PORTRAIT;

  const HTML = watch('content') || '';
  const CSS = watch('styles') || '';

<<<<<<< HEAD
  const placeholders = watch('placeholders') || [];

=======
>>>>>>> e6eb26b2a75b4c5828ca9ad8a68db06e044ce9bf
  return (
    <PDFViewer showToolbar style={styles.viewer}>
      <Document title={`Certificado: ${service.title}`}>
        <Page size="A4" orientation={orientation} style={styles.page}>
          <Html resetStyles>
            {`
              <html>
                <body>
                  <style>
                    ${CSS}
                  </style>

<<<<<<< HEAD
                  ${highlightPlaceholders(HTML, placeholders)}
=======
                  ${HTML}
>>>>>>> e6eb26b2a75b4c5828ca9ad8a68db06e044ce9bf
                </body>
              </html>
            `}
          </Html>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default CertificatePreview;
