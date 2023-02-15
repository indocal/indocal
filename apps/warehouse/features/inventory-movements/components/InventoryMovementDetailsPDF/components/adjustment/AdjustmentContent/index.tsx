import { View, Text, StyleSheet } from '@react-pdf/renderer';

import { InventoryMovement } from '@indocal/services';

import { InventoryMovementItemsTable } from '../../common';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    paddingHorizontal: 30,
  },
});

export interface AdjustmentContentProps {
  movement: InventoryMovement;
}

export const AdjustmentContent: React.FC<AdjustmentContentProps> = ({
  movement,
}) => (
  <View style={styles.container}>
    <Text style={{ fontFamily: 'Times-Bold', fontSize: 14 }}>
      II. - Detalles de Ajuste de Materiales, Equipos y/o Mobiliarios.
    </Text>

    <InventoryMovementItemsTable movement={movement} />
  </View>
);

export default AdjustmentContent;
