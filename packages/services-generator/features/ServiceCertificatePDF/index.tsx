import { PDFViewer, Document, Page, StyleSheet } from '@react-pdf/renderer';
import { Html } from 'react-pdf-html';

import { getShortUUID, ServiceCertificate } from '@indocal/services';

import {
  getAssetsSources,
  replaceInternals,
  replacePlaceholders,
} from './utils';

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

export interface ServiceCertificatePDFProps {
  certificate: ServiceCertificate;
  validationPage: string;
}

export const ServiceCertificatePDF: React.FC<ServiceCertificatePDFProps> = ({
  certificate,
  validationPage,
}) => {
  const content = certificate.template.content || '';
  const assets = certificate.template.assets || [];

  const hydratedContent = replaceInternals(
    getAssetsSources(content, assets),
    certificate,
    validationPage
  );

  return (
    <PDFViewer showToolbar style={styles.viewer}>
      <Document title={`Certificado: ${getShortUUID(certificate.id)}`}>
        <Page
          size="A4"
          orientation={certificate.template.layout.orientation}
          style={styles.page}
        >
          <Html resetStyles>
            {`
              <html>
                <body>
                  <style>
                    ${certificate.template.styles}
                  </style>

                  ${replacePlaceholders({
                    html: hydratedContent,
                    data: certificate.data,
                    placeholders: certificate.template.placeholders,
                  })}
                </body>
              </html>
            `}
          </Html>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default ServiceCertificatePDF;
