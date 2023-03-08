import { TableFormFieldColumn } from '@indocal/services';

export type TableFormFieldColumnAnswer<T> = {
  column: TableFormFieldColumn;
  content: T;
};

export default TableFormFieldColumnAnswer;
