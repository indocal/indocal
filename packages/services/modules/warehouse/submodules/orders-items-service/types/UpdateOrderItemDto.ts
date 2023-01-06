export type UpdateOrderItemDto = Partial<{
  price: number;
  quantity: number;
  received: number[];
}>;

export default UpdateOrderItemDto;
