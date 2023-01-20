export type UUID = string;

export interface Entity {
  id: UUID;
  createdAt: Date;
  updatedAt: Date;
}

export default Entity;
