export interface PartnerDao {
  id: number;
  tradingName: string;
  ownerName: string;
  document: string;
  coverageArea: {
    type: string;
    coordinates: number[][][][];
  };
  address: {
    type: string;
    coordinates: number[];
  };
}

export interface PartnerRepository {
  getAll(): Promise<PartnerDao[]>;
  save(partner: PartnerDao): Promise<void>;
}
