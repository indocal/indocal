import { AxiosResponse } from 'axios';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
  MultipleEntitiesResponse,
} from '../../../../common';
import { Config, ApiEndpoints } from '../../../../config';

import {
  Order,
  CreateOrderDto,
  UpdateOrderDto,
  CountOrdersParamsDto,
  FindManyOrdersParamsDto,
} from './types';

import { OrdersItemsService } from '../orders-items-service';

export interface CreateOrderReturn {
  order: Order | null;
  error: ServiceError | null;
}

export interface CountOrdersReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyOrdersReturn {
  orders: Order[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneOrderByUUIDReturn {
  order: Order | null;
  error: ServiceError | null;
}

export interface UpdateOrderReturn {
  order: Order | null;
  error: ServiceError | null;
}

export interface DeleteOrderReturn {
  order: Order | null;
  error: ServiceError | null;
}

export class OrdersService {
  items: OrdersItemsService;

  constructor(private config: Config) {
    this.items = new OrdersItemsService(config);
  }

  async create(data: CreateOrderDto): Promise<CreateOrderReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<Order>,
        AxiosResponse<SingleEntityResponse<Order>, CreateOrderDto>,
        CreateOrderDto
      >(ApiEndpoints.ORDERS, data);

      return {
        order: response.data,
        error: null,
      };
    } catch (error) {
      return {
        order: null,
        error: createServiceError(error),
      };
    }
  }

  async count(params?: CountOrdersParamsDto): Promise<CountOrdersReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.ORDERS_COUNT,
        { params }
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

  async findMany(
    params?: FindManyOrdersParamsDto
  ): Promise<FindManyOrdersReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<Order>
      >(ApiEndpoints.ORDERS, { params });

      return {
        orders: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        orders: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneOrderByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<Order | null>
      >(`${ApiEndpoints.ORDERS}/${id}`);

      return {
        order: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        order: null,
        error: createServiceError(error),
      };
    }
  }

  async update(id: UUID, data: UpdateOrderDto): Promise<UpdateOrderReturn> {
    try {
      const response = await this.config.axios.patch<
        SingleEntityResponse<Order>,
        AxiosResponse<SingleEntityResponse<Order>, UpdateOrderDto>,
        UpdateOrderDto
      >(`${ApiEndpoints.ORDERS}/${id}`, data);

      return {
        order: response.data,
        error: null,
      };
    } catch (error) {
      return {
        order: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteOrderReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<Order>
      >(`${ApiEndpoints.ORDERS}/${id}`);

      return {
        order: response.data,
        error: null,
      };
    } catch (error) {
      return {
        order: null,
        error: createServiceError(error),
      };
    }
  }
}

export default OrdersService;
