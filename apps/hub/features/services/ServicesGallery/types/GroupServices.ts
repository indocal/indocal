import { Service } from '@indocal/services';

export type GroupServices = {
  group: Service['group'];
  services: Service[];
};

export default GroupServices;
