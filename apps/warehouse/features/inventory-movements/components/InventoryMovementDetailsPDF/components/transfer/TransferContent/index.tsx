import { View, Text, StyleSheet } from '@react-pdf/renderer';

import { InventoryMovement } from '@indocal/services';

import { InventoryMovementItemsTable } from '../../common';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 30,
    paddingHorizontal: 30,
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    fontFamily: 'Times-Roman',
    fontSize: 12,
  },
  section: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    flex: 1,
    fontFamily: 'Times-Bold',
  },
  line: {
    flex: 1,
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Times-Italic',
    fontSize: 8,
    borderTop: '1px solid black',
  },
});

export interface TransferContentProps {
  movement: InventoryMovement;
}

export const TransferContent: React.FC<TransferContentProps> = ({
  movement,
}) => (
  <View style={styles.container}>
    <Text style={{ fontFamily: 'Times-Bold', fontSize: 14 }}>
      I. - Datos Generales de la Orden de Traslado.
    </Text>

    <View style={styles.info}>
      <View style={styles.section}>
        <View style={styles.item}>
          <Text>Procedencia de:</Text>

          <Text style={styles.line}></Text>
        </View>

        <View style={styles.item}>
          <Text>Recepción Final:</Text>

          <Text style={styles.line}></Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.item}>
          <Text>Modelo:</Text>

          <Text style={styles.line}></Text>
        </View>

        <View style={styles.item}>
          <Text>Fecha de Traslado:</Text>

          <Text style={styles.line}></Text>
        </View>
      </View>
    </View>

    <Text style={{ fontFamily: 'Times-Bold', fontSize: 14 }}>
      II. - Detalles de Traslado de Materiales, Equipos y/o Mobiliarios.
    </Text>

    <InventoryMovementItemsTable movement={movement} />
  </View>
);

export default TransferContent;
