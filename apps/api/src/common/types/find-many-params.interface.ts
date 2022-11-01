import Pagination from './pagination.interface';

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
