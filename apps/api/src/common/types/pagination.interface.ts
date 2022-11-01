export interface Pagination<WhereUniqueInput> {
  skip: number;
  take: number;
  cursor: WhereUniqueInput;
}

export default Pagination;
