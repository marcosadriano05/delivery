import {
  PartnerDao,
  PartnerRepository,
} from "../../src/domain/partner_repository.ts";
import { fakeData } from "./fake_data.ts";

export class FakePartnerRepo implements PartnerRepository {
  getById(id: number): Promise<PartnerDao> {
    throw new Error("Method not implemented.");
  }

  save(partner: PartnerDao): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getAll(): Promise<PartnerDao[]> {
    return new Promise((resolve) => resolve(fakeData));
  }
}
