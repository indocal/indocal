import { Config } from '../../config';

import {
  SuppliesService,
  SuppliersService,
  OrdersService,
  InventoryMovementsService,
  SuppliesRequestsService,
} from './submodules';

export class WarehouseService {
  supplies: SuppliesService;
  suppliers: SuppliersService;
  orders: OrdersService;
  movements: InventoryMovementsService;
  requests: SuppliesRequestsService;

  constructor(private config: Config) {
    this.supplies = new SuppliesService(config);
    this.suppliers = new SuppliersService(config);
    this.orders = new OrdersService(config);
    this.movements = new InventoryMovementsService(config);
    this.requests = new SuppliesRequestsService(config);
  }
}

export default WarehouseService;
