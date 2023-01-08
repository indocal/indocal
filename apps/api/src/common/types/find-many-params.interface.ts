export interface Pagination<WhereUniqueInput> {
  skip: number;
  take: number;
  cursor: WhereUniqueInput;
}

export interface FindManyParams<
  WhereInput,
  DistinctInput,
  OrderByInput,
  WhereUniqueInput
> {
  filters: WhereInput;
  distinct: DistinctInput;
  orderBy: OrderByInput;
  pagination: Pagination<WhereUniqueInput>;
}

export default FindManyParams;
