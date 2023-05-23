import { UUID } from '@/common';

import SerializedAnswer from './SerializedAnswer';

export type Row = Record<UUID, SerializedAnswer>;

export default Row;
