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

export interface TransferContentProps {
  movement: InventoryMovement;
}

export const TransferContent: React.FC<TransferContentProps> = ({
  movement,
}) => (
  <View style={styles.container}>
    <Text style={{ fontWeight: 'extrabold' }}>
      II. - Detalles de la Orden de Traslado de Equipos y /o Mobiliarios.
    </Text>

    <InventoryMovementItemsTable movement={movement} />
  </View>
);

export default TransferContent;
