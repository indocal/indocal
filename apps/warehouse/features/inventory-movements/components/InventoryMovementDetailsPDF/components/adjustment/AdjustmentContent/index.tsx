import { View, Text, StyleSheet } from '@react-pdf/renderer';

import { InventoryMovement } from '@indocal/services';

import { InventoryMovementItemsTable } from '../../common';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    paddingHorizontal: 40,
  },
});

export interface AdjustmentContentProps {
  movement: InventoryMovement;
}

export const AdjustmentContent: React.FC<AdjustmentContentProps> = ({
  movement,
}) => (
  <View style={styles.container}>
    <Text style={{ fontWeight: 'extrabold' }}>
      II. - Detalles de los Ajustes al Sistema
    </Text>

    <InventoryMovementItemsTable movement={movement} />
  </View>
);

export default AdjustmentContent;
