export interface CountParams<WhereInput, DistinctInput> {
  filters: WhereInput;
  distinct: DistinctInput;
}

export default CountParams;
