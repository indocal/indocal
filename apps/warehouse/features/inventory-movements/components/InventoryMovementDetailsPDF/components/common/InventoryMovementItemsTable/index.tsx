import { View, Text, StyleSheet } from '@react-pdf/renderer';

import { InventoryMovement } from '@indocal/services';

const styles = StyleSheet.create({
  table: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 15,
    fontWeight: 'extrabold',
    backgroundColor: 'lightblue',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 12,
  },
  cell: {
    padding: 5,
    border: '1px solid black',
  },
});

export interface InventoryMovementItemsTableProps {
  movement: InventoryMovement;
}

export const InventoryMovementItemsTable: React.FC<
  InventoryMovementItemsTableProps
> = ({ movement }) => (
  <View style={styles.table}>
    <View style={styles.header}>
      <Text style={{ ...styles.cell, width: 125 }}>Código</Text>

      <Text style={{ ...styles.cell, flex: 1 }}>
        Descripción de Equipo y/o Mobiliario
      </Text>

      <Text style={{ ...styles.cell, width: 125 }}>Cantidad</Text>
    </View>

    {movement.items.map((item) => (
      <View key={item.id} style={styles.row}>
        <Text style={{ ...styles.cell, width: 125 }}>{item.supply.code}</Text>

        <Text style={{ ...styles.cell, flex: 1 }}>{item.supply.name}</Text>

        <Text style={{ ...styles.cell, width: 125 }}>{item.quantity}</Text>
      </View>
    ))}
  </View>
);

export default InventoryMovementItemsTable;
