import { Service } from '@indocal/services';

import {
  LayoutConfig,
  ContentConfig,
  StylesConfig,
  AssetsConfig,
  PlaceholdersConfig,
} from './components';

export interface DesignConfigProps {
  service: Service;
}

export const DesignConfig: React.FC<DesignConfigProps> = ({ service }) => (
  <>
    <LayoutConfig />
    <ContentConfig />
    <StylesConfig />
    <AssetsConfig service={service} />
    <PlaceholdersConfig service={service} />
  </>
);

export default DesignConfig;
