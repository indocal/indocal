import { UUID } from '../../types';

export function getShortUUID(id: UUID): string {
  return `#-${id.slice(-5).toUpperCase()}`;
}

export default getShortUUID;
