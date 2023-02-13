import {
  View,
  Image as ReactPDFImage,
  Text,
  StyleSheet,
} from '@react-pdf/renderer';

import { logo } from '../../../assets';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  logo: {
    width: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  metadata: {
    width: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
});

export const DischargeHeader: React.FC = () => (
  <View style={styles.container}>
    <View style={styles.logo}>
      <ReactPDFImage
        src={logo.src}
        style={{ width: 75, height: 'auto', objectFit: 'cover' }}
      />
    </View>

    <View style={styles.heading}>
      <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
        Formulario Descargos de Equipos y/o Mobiliarios
      </Text>

      <Text style={{ fontSize: 15, fontWeight: 'extrabold' }}>
        Instituto Dominicano para la Calidad
      </Text>

      <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
        Sección Almacén y Suministro
      </Text>
    </View>

    <View style={styles.metadata}>
      <Text style={{ fontSize: 10, fontWeight: 'bold' }}>FO-SAS-005</Text>

      <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Revisión No.00</Text>
    </View>
  </View>
);

export default DischargeHeader;
