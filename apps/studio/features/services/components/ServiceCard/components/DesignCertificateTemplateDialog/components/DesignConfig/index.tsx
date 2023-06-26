import { Service } from '@indocal/services';

import {
  LayoutConfig,
  ContentConfig,
  StylesConfig,
  PlaceholdersConfig,
} from './components';

export interface DesignConfigProps {
  service: Service;
}

export const DesignConfig: React.FC<DesignConfigProps> = () => (
  <>
    <LayoutConfig />
    <ContentConfig />
    <StylesConfig />
    <PlaceholdersConfig />
  </>
);

export default DesignConfig;
