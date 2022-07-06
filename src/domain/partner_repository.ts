export interface PartnerDao {
  id: number;
  tradingName: string;
  ownerName: string;
  document: string;
  coverageArea: {
    id: number;
    type: string;
    coordinates: number[][][][];
  };
  address: {
    id: number;
    type: string;
    coordinates: number[];
  };
}

export interface PartnerRepository {
  getAll(): Promise<PartnerDao[]>;
  getById(id: number): Promise<PartnerDao>;
  save(partner: PartnerDao): Promise<void>;
}
