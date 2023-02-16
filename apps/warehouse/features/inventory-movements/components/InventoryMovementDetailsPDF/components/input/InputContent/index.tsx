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
    textAlign: 'center',
    fontFamily: 'Times-Italic',
    fontSize: 10,
    borderBottom: '1px solid black',
  },
});

export interface InputContentProps {
  movement: InventoryMovement;
}

export const InputContent: React.FC<InputContentProps> = ({ movement }) => (
  <View style={styles.container}>
    <Text style={{ fontFamily: 'Times-Bold', fontSize: 14 }}>
      I. - Datos Generales del Suplidor.
    </Text>

    <View style={styles.info}>
      <View style={styles.section}>
        <View style={styles.item}>
          <Text>Suplidor:</Text>

          <Text style={styles.line}>{movement.order?.supplier.name}</Text>
        </View>

        <View style={styles.item}>
          <Text>Orden de Compra No.:</Text>

          <Text style={styles.line}>{movement.order?.code}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.item}>
          <Text>Concepto de la Compra:</Text>

          <Text style={styles.line}>{movement.order?.concept}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.item}>
          <Text>Factura No.:</Text>

          <Text style={styles.line} />
        </View>

        <View style={styles.item}>
          <Text>NCF:</Text>

          <Text style={styles.line} />
        </View>

        <View style={styles.item}>
          <Text>Fecha de Fact.:</Text>

          <Text style={styles.line} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.item}>
          <Text>Área Solicitante:</Text>

          <Text style={styles.line}>{movement.order?.requestedBy.name}</Text>
        </View>
      </View>
    </View>

    <Text style={{ fontFamily: 'Times-Bold', fontSize: 14 }}>
      II. - Detalles de Entrada de Materiales, Equipos y/o Mobiliarios.
    </Text>

    <InventoryMovementItemsTable movement={movement} />
  </View>
);

export default InputContent;
