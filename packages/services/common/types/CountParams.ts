export type CountParams<WhereInput, DistinctInput> = Partial<{
  filters: WhereInput;
  distinct: DistinctInput;
}>;

export default CountParams;
