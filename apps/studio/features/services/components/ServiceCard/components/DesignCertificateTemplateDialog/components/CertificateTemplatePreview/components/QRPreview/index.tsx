import { View, Image as ImagePDF, StyleSheet } from '@react-pdf/renderer';
import { useFormContext } from 'react-hook-form';
import QRCode from 'qrcode';

export const QRPreview: React.FC = () => {
  const { watch } = useFormContext();

  const QR = QRCode.toDataURL('https://indocal.gob.do/');

  const includeQR = watch('qr.include');
  const QRSize = watch('qr.size');
  const QRPosition = watch('qr.position');

  const styles = StyleSheet.create({
    qr: {
      position: 'absolute',
      top: QRPosition?.top,
      left: QRPosition?.left,
      bottom: QRPosition?.bottom,
      right: QRPosition?.right,
      width: QRSize,
      height: QRSize,
    },
  });

  if (!includeQR) return null;

  return (
    <View style={styles.qr}>
      <ImagePDF src={QR} />
    </View>
  );
};

export default QRPreview;
