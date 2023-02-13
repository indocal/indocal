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

export interface DischargeContentProps {
  movement: InventoryMovement;
}

export const DischargeContent: React.FC<DischargeContentProps> = ({
  movement,
}) => (
  <View style={styles.container}>
    <Text style={{ fontWeight: 'extrabold' }}>
      II. - Detalles del Descargo de Materiales, Equipos y /o Mobiliarios.
    </Text>

    <InventoryMovementItemsTable movement={movement} />
  </View>
);

export default DischargeContent;
