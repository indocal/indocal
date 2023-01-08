export type Pagination<WhereUniqueInput> = Partial<{
  skip: number;
  take: number;
  cursor: WhereUniqueInput;
}>;

export type FindManyParams<
  WhereInput,
  DistinctInput,
  OrderByInput,
  WhereUniqueInput
> = Partial<{
  filters: WhereInput;
  distinct: DistinctInput;
  orderBy: OrderByInput;
  pagination: Pagination<WhereUniqueInput>;
}>;

export default FindManyParams;
