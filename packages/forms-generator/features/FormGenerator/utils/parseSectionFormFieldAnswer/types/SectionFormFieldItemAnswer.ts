import { SectionFormFieldItem } from '@indocal/services';

export type SectionFormFieldItemAnswer<T> = {
  item: SectionFormFieldItem;
  content: T;
};

export default SectionFormFieldItemAnswer;
