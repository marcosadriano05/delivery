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

export interface PartnerRepository {
  getAll(): Promise<PartnerDto[]>;
  getById(id: number): Promise<PartnerDto>;
  save(partner: PartnerDto): Promise<void>;
}
