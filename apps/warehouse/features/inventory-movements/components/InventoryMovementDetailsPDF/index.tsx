import { useMemo } from 'react';
import { PDFViewer, Document, Page, StyleSheet } from '@react-pdf/renderer';

import {
  getShortUUID,
  InventoryMovement,
  InventoryMovementType,
} from '@indocal/services';

import {
  AdjustmentHeader,
  AdjustmentContent,
  AdjustmentFooter,
  InputHeader,
  InputContent,
  InputFooter,
  OutputHeader,
  OutputContent,
  OutputFooter,
  TransferHeader,
  TransferContent,
  TransferFooter,
  DischargeHeader,
  DischargeContent,
  DischargeFooter,
} from './components';

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

export interface InventoryMovementDetailsPDFProps {
  movement: InventoryMovement;
}

export const InventoryMovementDetailsPDF: React.FC<
  InventoryMovementDetailsPDFProps
> = ({ movement }) => {
  const headers = useMemo<Record<InventoryMovementType, React.ReactElement>>(
    () => ({
      ADJUSTMENT: <AdjustmentHeader />,
      INPUT: <InputHeader />,
      OUTPUT: <OutputHeader />,
      TRANSFER: <TransferHeader />,
      DISCHARGE: <DischargeHeader />,
    }),
    []
  );

  const contents = useMemo<Record<InventoryMovementType, React.ReactElement>>(
    () => ({
      ADJUSTMENT: <AdjustmentContent movement={movement} />,
      INPUT: <InputContent movement={movement} />,
      OUTPUT: <OutputContent movement={movement} />,
      TRANSFER: <TransferContent movement={movement} />,
      DISCHARGE: <DischargeContent movement={movement} />,
    }),
    [movement]
  );

  const footers = useMemo<Record<InventoryMovementType, React.ReactElement>>(
    () => ({
      ADJUSTMENT: <AdjustmentFooter movement={movement} />,
      INPUT: <InputFooter movement={movement} />,
      OUTPUT: <OutputFooter movement={movement} />,
      TRANSFER: <TransferFooter movement={movement} />,
      DISCHARGE: <DischargeFooter movement={movement} />,
    }),
    [movement]
  );

  return (
    <PDFViewer showToolbar style={styles.viewer}>
      <Document title={`Movimiento ${getShortUUID(movement.id)}`}>
        <Page size="A4" style={styles.page}>
          {headers[movement.type]}
          {contents[movement.type]}
          {footers[movement.type]}
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default InventoryMovementDetailsPDF;
