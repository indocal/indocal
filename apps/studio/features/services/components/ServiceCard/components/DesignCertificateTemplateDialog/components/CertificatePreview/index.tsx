import { PDFViewer, Document, Page, StyleSheet } from '@react-pdf/renderer';
import { Html } from 'react-pdf-html';
import { useFormContext } from 'react-hook-form';

import {
  Service,
  ServiceCertificateTemplateLayoutOrientation,
} from '@indocal/services';

import { DesignCertificateTemplateDialogData } from '../../context';
import {
  getAssetsSources,
  previewInternals,
  highlightPlaceholders,
} from '../../utils';

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
    ServiceCertificateTemplateLayoutOrientation.PORTRAIT;

  const HTML = watch('content') || '';
  const CSS = watch('styles') || '';

  const placeholders = service.template?.placeholders || [];
  const assets = service.template?.assets || [];

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

                  ${highlightPlaceholders(
                    previewInternals(getAssetsSources(HTML, assets), service),
                    placeholders
                  )}
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
