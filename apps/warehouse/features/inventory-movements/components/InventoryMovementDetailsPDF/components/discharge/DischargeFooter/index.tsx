import { View, StyleSheet } from '@react-pdf/renderer';

import { InventoryMovement } from '@indocal/services';

const styles = StyleSheet.create({
  container: {},
});

export interface DischargeFooterProps {
  movement: InventoryMovement;
}

export const DischargeFooter: React.FC<DischargeFooterProps> = () => (
  <View style={styles.container}></View>
);

export default DischargeFooter;
