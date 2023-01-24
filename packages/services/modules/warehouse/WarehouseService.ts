import { AxiosResponse } from 'axios';

import { createServiceError, ServiceError } from '../../common';
import { Config } from '../../config';

import { ReceiveItemsDto } from './types';

import {
  SuppliesService,
  SuppliersService,
  OrdersService,
  InventoryMovementsService,
} from './submodules';

export interface ReceiveItemsReturn {
  error: ServiceError | null;
}

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

  async receiveItems(data: ReceiveItemsDto): Promise<ReceiveItemsReturn> {
    try {
      await this.config.axios.patch<
        void,
        AxiosResponse<void, ReceiveItemsDto>,
        ReceiveItemsDto
      >('warehouse/actions/receive-items', data);

      return {
        error: null,
      };
    } catch (error) {
      return {
        error: createServiceError(error),
      };
    }
  }
}

export default WarehouseService;
