import {
  PartnerDto,
  PartnerRepository,
} from "../../src/domain/partner_repository.ts";
import { fakeData } from "./fake_data.ts";

export class FakePartnerRepo implements PartnerRepository {
  getById(id: number): Promise<PartnerDto> {
    throw new Error("Method not implemented.");
  }

  save(partner: PartnerDto): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getAll(): Promise<PartnerDto[]> {
    return new Promise((resolve) => resolve(fakeData));
  }
}
