import React, { useMemo } from 'react';
import { PDFViewer, Document, Page, StyleSheet } from '@react-pdf/renderer';

import {
  getShortUUID,
  InventoryMovement,
  InventoryMovementType,
} from '@indocal/services';

import {
  InputHeader,
  OutputHeader,
  TransferHeader,
  DischargeHeader,
} from './components';

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
> = ({ movement }) => {
  const headers = useMemo<Record<InventoryMovementType, React.ReactElement>>(
    () => ({
      ADJUSTMENT: <></>,
      INPUT: <InputHeader />,
      OUTPUT: <OutputHeader />,
      TRANSFER: <TransferHeader />,
      DISCHARGE: <DischargeHeader />,
    }),
    []
  );

  const contents = useMemo<Record<InventoryMovementType, React.ReactElement>>(
    () => ({
      ADJUSTMENT: <></>,
      INPUT: <></>,
      OUTPUT: <></>,
      TRANSFER: <></>,
      DISCHARGE: <></>,
    }),
    []
  );

  const footers = useMemo<Record<InventoryMovementType, React.ReactElement>>(
    () => ({
      ADJUSTMENT: <></>,
      INPUT: <></>,
      OUTPUT: <></>,
      TRANSFER: <></>,
      DISCHARGE: <></>,
    }),
    []
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
