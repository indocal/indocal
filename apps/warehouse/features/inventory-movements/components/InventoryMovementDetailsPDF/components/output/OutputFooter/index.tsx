import { View, StyleSheet } from '@react-pdf/renderer';

import { InventoryMovement } from '@indocal/services';

const styles = StyleSheet.create({
  container: {},
});

export interface OutputFooterProps {
  movement: InventoryMovement;
}

export const OutputFooter: React.FC<OutputFooterProps> = () => (
  <View style={styles.container}></View>
);

export default OutputFooter;
