import { Config } from '../../config';

import { SuppliesService, SuppliersService, OrdersService } from './submodules';

export class WarehouseService {
  supplies: SuppliesService;
  suppliers: SuppliersService;
  orders: OrdersService;

  constructor(private config: Config) {
    this.supplies = new SuppliesService(config);
    this.suppliers = new SuppliersService(config);
    this.orders = new OrdersService(config);
  }
}

export default WarehouseService;
