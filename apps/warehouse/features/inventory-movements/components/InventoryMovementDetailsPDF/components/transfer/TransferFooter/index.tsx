import { View, StyleSheet } from '@react-pdf/renderer';

import { InventoryMovement } from '@indocal/services';

const styles = StyleSheet.create({
  container: {},
});

export interface TransferFooterProps {
  movement: InventoryMovement;
}

export const TransferFooter: React.FC<TransferFooterProps> = () => (
  <View style={styles.container}></View>
);

export default TransferFooter;
