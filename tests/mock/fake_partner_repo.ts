import { PartnerDto, Repository } from "../../src/domain/repository.ts";
import { fakeData } from "./fake_data.ts";

export class FakePartnerRepo implements Repository<PartnerDto> {
  getById(id: number): Promise<PartnerDto | null> {
    const partner = fakeData.find((data) => data.id === id);
    if (!partner) {
      return new Promise((resolve) => resolve(null));
    }
    return new Promise((resolve) => resolve(partner));
  }

  save(data: PartnerDto): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getAll(): Promise<PartnerDto[]> {
    return new Promise((resolve) => resolve(fakeData));
  }
}
