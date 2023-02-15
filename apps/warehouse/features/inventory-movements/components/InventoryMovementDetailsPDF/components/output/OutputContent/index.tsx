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

export interface OutputContentProps {
  movement: InventoryMovement;
}

export const OutputContent: React.FC<OutputContentProps> = ({ movement }) => (
  <View style={styles.container}>
    <Text style={{ fontFamily: 'Times-Bold', fontSize: 14 }}>
      I. - Datos del Solicitante.
    </Text>

    <View style={styles.info}>
      <View style={styles.section}>
        <View style={styles.item}>
          <Text>Área Solicitante:</Text>

          <Text style={styles.line}></Text>
        </View>

        <View style={styles.item}>
          <Text>Fecha de Solicitud:</Text>

          <Text style={styles.line}>(DD/MM/AAAA)</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.item}>
          <Text>Firma Autorizada:</Text>

          <Text style={styles.line}>(Responsable del Área Solicitante)</Text>
        </View>

        <View style={styles.item}>
          <Text>Recibido Conforme por:</Text>

          <Text style={styles.line}>
            (Persona que Recibe del Área Solicitante)
          </Text>
        </View>
      </View>
    </View>

    <Text style={{ fontFamily: 'Times-Bold', fontSize: 14 }}>
      II. - Detalles de Salida de Materiales, Equipos y/o Mobiliarios.
    </Text>

    <InventoryMovementItemsTable movement={movement} />
  </View>
);

export default OutputContent;
