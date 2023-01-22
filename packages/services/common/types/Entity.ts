export type UUID = string;

export interface Entity {
  id: UUID;
  createdAt: string;
  updatedAt: string;
}

export default Entity;
