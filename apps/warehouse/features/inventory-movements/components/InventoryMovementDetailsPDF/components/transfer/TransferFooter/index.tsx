import { View, Text, StyleSheet } from '@react-pdf/renderer';

import { InventoryMovement } from '@indocal/services';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    paddingHorizontal: 20,
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

export interface TransferFooterProps {
  movement: InventoryMovement;
}

export const TransferFooter: React.FC<TransferFooterProps> = () => (
  <View style={styles.container}>
    <View style={styles.section}>
      <View style={styles.item}>
        <Text>Autorizado por:</Text>

        <Text style={styles.line}>
          (Nombre Director Administrativo y Financiero)
        </Text>
      </View>

      <View style={styles.item}>
        <Text>Firma:</Text>

        <Text style={styles.line}>
          (Firma Director Administrativo y Financiero)
        </Text>
      </View>
    </View>

    <View style={styles.section}>
      <View style={styles.item}>
        <Text>Entregado por:</Text>

        <Text style={styles.line}>
          (Nombre de quien Entrega de Almacén y Suministro)
        </Text>
      </View>

      <View style={styles.item}>
        <Text>Recibido por:</Text>

        <Text style={styles.line}>
          (Nombre de quien Recibe en el Área de Destino)
        </Text>
      </View>
    </View>
  </View>
);

export default TransferFooter;
