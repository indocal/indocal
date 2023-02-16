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

export interface DischargeContentProps {
  movement: InventoryMovement;
}

export const DischargeContent: React.FC<DischargeContentProps> = ({
  movement,
}) => (
  <View style={styles.container}>
    <Text style={{ fontFamily: 'Times-Bold', fontSize: 14 }}>
      I. - Datos Generales del Descargo.
    </Text>

    <View style={styles.info}>
      <View style={styles.section}>
        <View style={styles.item}>
          <Text>Procedencia de:</Text>

          <Text style={styles.line}>{movement.origin?.name}</Text>
        </View>

        <View style={styles.item}>
          <Text>Recepción Final:</Text>

          <Text style={styles.line}>Dpto. Servicios Generales</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.item}>
          <Text>Modelo:</Text>

          <Text style={styles.line}></Text>
        </View>

        <View style={styles.item}>
          <Text>Fecha de Descargo:</Text>

          <Text style={styles.line}>
            {new Date(movement.createdAt).toLocaleDateString('es-do')}
          </Text>
        </View>
      </View>
    </View>

    <Text style={{ fontFamily: 'Times-Bold', fontSize: 14 }}>
      II. - Detalles de Descargo de Materiales, Equipos y/o Mobiliarios.
    </Text>

    <InventoryMovementItemsTable movement={movement} />
  </View>
);

export default DischargeContent;
