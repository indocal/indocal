import { Config } from '../../config';

import { SuppliersService } from './submodules';

export class WarehouseService {
  suppliers: SuppliersService;

  constructor(private config: Config) {
    this.suppliers = new SuppliersService(config);
  }
}

export default WarehouseService;
