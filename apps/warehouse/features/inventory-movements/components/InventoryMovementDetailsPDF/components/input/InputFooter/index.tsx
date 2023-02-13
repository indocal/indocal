import { View, StyleSheet } from '@react-pdf/renderer';

import { InventoryMovement } from '@indocal/services';

const styles = StyleSheet.create({
  container: {},
});

export interface InputFooterProps {
  movement: InventoryMovement;
}

export const InputFooter: React.FC<InputFooterProps> = () => (
  <View style={styles.container}></View>
);

export default InputFooter;
