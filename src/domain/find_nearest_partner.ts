import { Address, CoverageArea, Partner, Point } from "./entities.ts";
import { PartnerDao, PartnerRepository } from "./partner_repository.ts";

export class FindPartnerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FindPartnerError";
  }
}

export class FindNearestPartner {
  constructor(readonly partnerRepository: PartnerRepository) {}

  async exec(lat: number, lon: number): Promise<PartnerDao> {
    const partnersDao = await this.partnerRepository.getAll();

    const address = new Address(lat, lon);
    const partners = partnersDao.map((partnerDao) => {
      const coverageArea = new CoverageArea(
        this.coordinatesToPoints(partnerDao.coverageArea.coordinates),
      );
      coverageArea.id = partnerDao.coverageArea.id;
      const address = new Address(
        partnerDao.address.coordinates[0],
        partnerDao.address.coordinates[1],
      );
      address.id = partnerDao.address.id;
      const partner = new Partner(
        partnerDao.tradingName,
        partnerDao.ownerName,
        partnerDao.document,
        coverageArea,
        address,
      );
      partner.id = partnerDao.id;
      return partner;
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
    const nearestPartner = partnersWhoCoverTheAddress[partnerIndex];

    return this.transformPartnerToPartnerDao(nearestPartner)
  }

  coordinatesToPoints(coordinates: number[][][][]): Point[][][] {
    return coordinates.map((item1) => {
      return item1.map((item2) => {
        return item2.map((item3) => new Point(item3[0], item3[1]));
      });
    });
  }

  pointsToCoordinates(points: Point[][][]): number[][][][] {
    return points.map((item1) => {
      return item1.map((item2) => {
        return item2.map((item3) => [item3.x, item3.y]);
      });
    });
  }

  distanceBetweenTwoPoints(pointA: Point, pointB: Point): number {
    return Math.sqrt(
      Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2),
    );
  }

  transformPartnerToPartnerDao(partner: Partner): PartnerDao {
    const partnerDao: PartnerDao = {
      id: partner.id,
      ownerName: partner.ownerName,
      tradingName: partner.tradingName,
      document: partner.document,
      address: {
        id: partner.address.id,
        type: partner.address.type,
        coordinates: [
          partner.address.coordinates.x,
          partner.address.coordinates.y,
        ],
      },
      coverageArea: {
        id: partner.coverageArea.id,
        type: partner.coverageArea.type,
        coordinates: this.pointsToCoordinates(partner.coverageArea.coordinates),
      },
    };
    return partnerDao;
  }
}
