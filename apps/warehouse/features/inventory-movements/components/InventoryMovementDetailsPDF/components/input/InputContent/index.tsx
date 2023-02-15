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

export interface InputContentProps {
  movement: InventoryMovement;
}

export const InputContent: React.FC<InputContentProps> = ({ movement }) => (
  <View style={styles.container}>
    <Text style={{ fontFamily: 'Times-Bold', fontSize: 14 }}>
      II. - Detalles de Entrada de Materiales, Equipos y/o Mobiliarios.
    </Text>

    <InventoryMovementItemsTable movement={movement} />
  </View>
);

export default InputContent;
