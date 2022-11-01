export type Pagination<WhereUniqueInput> = Partial<{
  skip: number;
  take: number;
  cursor: WhereUniqueInput;
}>;

export default Pagination;
