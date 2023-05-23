import { View, Image as ImagePDF, StyleSheet } from '@react-pdf/renderer';
import { useFormContext } from 'react-hook-form';

import { Service } from '@indocal/services';

export interface BackgroundPreviewProps {
  service: Service;
}

export const BackgroundPreview: React.FC<BackgroundPreviewProps> = ({
  service,
}) => {
  const { watch } = useFormContext();

  const includeBackground = watch('background.include');
  const backgroundImage = watch('background.image');

  const background = backgroundImage
    ? URL.createObjectURL(backgroundImage[0])
    : service.template?.background
    ? new URL(
        service.template.background.path,
        process.env.NEXT_PUBLIC_BACKEND_URL
      ).toString()
    : null;

  const styles = StyleSheet.create({
    background: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      border: 'none',
    },
  });

  if (!includeBackground || !background) return null;

  return (
    <View style={styles.background}>
      <ImagePDF src={background} style={{ width: '100%', height: '100%' }} />
    </View>
  );
};

export default BackgroundPreview;
