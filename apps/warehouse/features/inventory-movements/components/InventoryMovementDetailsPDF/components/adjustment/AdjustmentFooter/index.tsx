import { View, StyleSheet } from '@react-pdf/renderer';

import { InventoryMovement } from '@indocal/services';

const styles = StyleSheet.create({
  container: {},
});

export interface AdjustmentFooterProps {
  movement: InventoryMovement;
}

export const AdjustmentFooter: React.FC<AdjustmentFooterProps> = () => (
  <View style={styles.container}></View>
);

export default AdjustmentFooter;
