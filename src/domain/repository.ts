export interface PartnerDto {
  id?: number;
  tradingName: string;
  ownerName: string;
  document: string;
  coverageArea: {
    id?: number;
    type: string;
    coordinates: number[][][][];
  };
  address: {
    id?: number;
    type: string;
    coordinates: number[];
  };
}

export interface Repository<T> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T>;
  save(data: T): Promise<void>;
}
