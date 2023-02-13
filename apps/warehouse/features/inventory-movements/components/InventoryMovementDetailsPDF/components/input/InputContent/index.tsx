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

export interface InputContentProps {
  movement: InventoryMovement;
}

export const InputContent: React.FC<InputContentProps> = ({ movement }) => (
  <View style={styles.container}>
    <Text style={{ fontWeight: 'extrabold' }}>
      II. - Detalles del Material, Equipo y/o Mobiliario Recibido.
    </Text>

    <InventoryMovementItemsTable movement={movement} />
  </View>
);

export default InputContent;
