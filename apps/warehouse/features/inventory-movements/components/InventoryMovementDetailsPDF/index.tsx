import { PDFViewer, Document, Page, StyleSheet } from '@react-pdf/renderer';

import { InventoryMovement } from '@indocal/services';

const styles = StyleSheet.create({
  viewer: {
    width: '100%',
    height: '100%',
    border: 0,
  },
  page: {
    position: 'relative',
  },
});

export interface InventoryMovementDetailsPDFProps {
  movement: InventoryMovement;
}

export const InventoryMovementDetailsPDF: React.FC<
  InventoryMovementDetailsPDFProps
> = () => {
  return (
    <PDFViewer showToolbar style={styles.viewer}>
      <Document>
        <Page size="A4" style={styles.page}></Page>
      </Document>
    </PDFViewer>
  );
};

export default InventoryMovementDetailsPDF;
