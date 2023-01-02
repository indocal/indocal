import { Config } from '../../config';

import { SuppliesService, SuppliersService } from './submodules';

export class WarehouseService {
  supplies: SuppliesService;
  suppliers: SuppliersService;

  constructor(private config: Config) {
    this.supplies = new SuppliesService(config);
    this.suppliers = new SuppliersService(config);
  }
}

export default WarehouseService;
