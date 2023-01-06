import { AxiosResponse } from 'axios';

import { ServiceError, createServiceError, UUID } from '../../../../common';
import { Config, ApiEndpoints } from '../../../../config';

import { Order } from '../orders-service';

import { OrderItem, CreateOrderItemDto, UpdateOrderItemDto } from './types';

export interface CreateOrderItemReturn {
  item: OrderItem | null;
  error: ServiceError | null;
}

export interface CountOrderItemsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindAllOrderItemsReturn {
  items: OrderItem[];
  error: ServiceError | null;
}

export interface FindOneOrderItemByUUIDReturn {
  item: OrderItem | null;
  error: ServiceError | null;
}

export interface UpdateOrderItemReturn {
  item: OrderItem | null;
  error: ServiceError | null;
}

export interface DeleteOrderItemReturn {
  item: OrderItem | null;
  error: ServiceError | null;
}

export class OrdersItemsService {
  constructor(private config: Config) {}

  private getUUID(order: UUID | Order): UUID {
    return typeof order === 'string' ? order : order.id;
  }

  async create(
    order: UUID | Order,
    data: CreateOrderItemDto
  ): Promise<CreateOrderItemReturn> {
    try {
      const response = await this.config.axios.post<
        OrderItem,
        AxiosResponse<OrderItem, CreateOrderItemDto>,
        CreateOrderItemDto
      >(`${ApiEndpoints.ORDERS}/${this.getUUID(order)}/items`, data);

      return {
        item: response.data,
        error: null,
      };
    } catch (error) {
      return {
        item: null,
        error: createServiceError(error),
      };
    }
  }

  async count(order: UUID | Order): Promise<CountOrderItemsReturn> {
    try {
      const response = await this.config.axios.get<number>(
        `${ApiEndpoints.ORDERS}/${this.getUUID(order)}/items/count`
      );

      return {
        count: response.data,
        error: null,
      };
    } catch (error) {
      return {
        count: null,
        error: createServiceError(error),
      };
    }
  }

  async findAll(order: UUID | Order): Promise<FindAllOrderItemsReturn> {
    try {
      const response = await this.config.axios.get<OrderItem[]>(
        `${ApiEndpoints.ORDERS}/${this.getUUID(order)}/items`
      );

      return {
        items: response.data,
        error: null,
      };
    } catch (error) {
      return {
        items: [],
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneOrderItemByUUIDReturn> {
    try {
      const response = await this.config.axios.get<OrderItem | null>(
        `${ApiEndpoints.ORDERS}/items/${id}`
      );

      return {
        item: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        item: null,
        error: createServiceError(error),
      };
    }
  }

  async update(
    id: UUID,
    data: UpdateOrderItemDto
  ): Promise<UpdateOrderItemReturn> {
    try {
      const response = await this.config.axios.patch<
        OrderItem,
        AxiosResponse<OrderItem, UpdateOrderItemDto>,
        UpdateOrderItemDto
      >(`${ApiEndpoints.ORDERS}/items/${id}`, data);

      return {
        item: response.data,
        error: null,
      };
    } catch (error) {
      return {
        item: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteOrderItemReturn> {
    try {
      const response = await this.config.axios.delete<OrderItem>(
        `${ApiEndpoints.ORDERS}/items/${id}`
      );

      return {
        item: response.data,
        error: null,
      };
    } catch (error) {
      return {
        item: null,
        error: createServiceError(error),
      };
    }
  }
}

export default OrdersItemsService;
