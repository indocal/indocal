import { Config } from '../../config';

import { WarehouseSuppliersService } from './submodules';

export class WarehouseService {
  suppliers: WarehouseSuppliersService;

  constructor(private config: Config) {
    this.suppliers = new WarehouseSuppliersService(config);
  }
}

export default WarehouseService;
