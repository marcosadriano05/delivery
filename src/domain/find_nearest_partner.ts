import { Address, CoverageArea, Partner, Point } from "./entities.ts";
import { PartnerRepository } from "./partner_repository.ts";

export class FindPartnerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FindPartnerError";
  }
}

export class FindNearestPartner {
  constructor(readonly partnerRepository: PartnerRepository) {}

  async exec(lat: number, lon: number): Promise<Partner> {
    const partnersDao = await this.partnerRepository.getAll();

    const address = new Address(lat, lon);
    const partners = partnersDao.map((partnerDao) => {
      return new Partner(
        partnerDao.tradingName,
        partnerDao.ownerName,
        partnerDao.document,
        new CoverageArea(
          this.coordinatesToPoints(partnerDao.coverageArea.coordinates),
        ),
        new Address(
          partnerDao.address.coordinates[0],
          partnerDao.address.coordinates[1],
        ),
      );
    });

    const partnersWhoCoverTheAddress = partners.filter((partner) =>
      partner.coverageArea.isAddressIn(address)
    );

    if (partnersWhoCoverTheAddress.length === 0) {
      throw new FindPartnerError("No partner cover this address.");
    }

    let nearDistance = this.distanceBetweenTwoPoints(
      address.coordinates,
      partnersWhoCoverTheAddress[0].address.coordinates,
    );
    let partnerIndex = 0;
    for (let i = 1; i < partnersWhoCoverTheAddress.length; i++) {
      const distance = this.distanceBetweenTwoPoints(
        address.coordinates,
        partnersWhoCoverTheAddress[i].address.coordinates,
      );
      if (distance < nearDistance) {
        nearDistance = distance;
        partnerIndex = i;
      }
    }

    return partnersWhoCoverTheAddress[partnerIndex];
  }

  coordinatesToPoints(coordinates: number[][][][]): Point[][][] {
    return coordinates.map((item1) => {
      return item1.map((item2) => {
        return item2.map((item3) => new Point(item3[0], item3[1]));
      });
    });
  }

  distanceBetweenTwoPoints(pointA: Point, pointB: Point): number {
    return Math.sqrt(
      Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2),
    );
  }
}
