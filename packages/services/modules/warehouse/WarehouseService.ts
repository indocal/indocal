import { Config } from '../../config';

import {
  SuppliesService,
  SuppliersService,
  OrdersService,
  InventoryMovementsService,
} from './submodules';

export class WarehouseService {
  supplies: SuppliesService;
  suppliers: SuppliersService;
  orders: OrdersService;
  movements: InventoryMovementsService;

  constructor(private config: Config) {
    this.supplies = new SuppliesService(config);
    this.suppliers = new SuppliersService(config);
    this.orders = new OrdersService(config);
    this.movements = new InventoryMovementsService(config);
  }
}

export default WarehouseService;
