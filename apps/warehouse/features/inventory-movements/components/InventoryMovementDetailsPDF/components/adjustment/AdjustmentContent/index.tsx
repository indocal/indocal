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

export interface AdjustmentContentProps {
  movement: InventoryMovement;
}

export const AdjustmentContent: React.FC<AdjustmentContentProps> = ({
  movement,
}) => (
  <View style={styles.container}>
    <Text style={{ fontFamily: 'Times-Bold', fontSize: 14 }}>
      I. - Datos Generales del Ajuste.
    </Text>

    <View style={styles.info}>
      <View style={styles.section}>
        <View style={styles.item}>
          <Text>Concepto:</Text>

          <Text style={styles.line}>{movement.concept}</Text>
        </View>

        <View style={styles.item}>
          <Text>Fecha de Ajuste:</Text>

          <Text style={styles.line}>
            {new Date(movement.createdAt).toLocaleDateString('es-do')}
          </Text>
        </View>
      </View>
    </View>

    <Text style={{ fontFamily: 'Times-Bold', fontSize: 14 }}>
      II. - Detalles de Ajuste de Materiales, Equipos y/o Mobiliarios.
    </Text>

    <InventoryMovementItemsTable movement={movement} />
  </View>
);

export default AdjustmentContent;
