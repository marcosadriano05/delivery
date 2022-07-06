import { PartnerDao, PartnerRepository } from "../domain/partner_repository.ts";
import { Client } from "../../deps/postgres.ts";

export class PostgresRepository implements PartnerRepository {
  constructor(
    private readonly client: Client,
  ) {}

  async getById(id: number): Promise<PartnerDao> {
    const partner = await this.client.queryArray(
      `SELECT p.id, p.trading_name, p.owner_name, p."document", a.id, a."type", a.coordinates, ca.id, ca."type", ca.coordinates FROM partner p
      INNER JOIN address a ON a.partner_id = p.id 
      INNER JOIN coverage_area ca ON ca.partner_id = p.id
      WHERE p.id = $1;`,
      [id],
    );
    return transformInPartnerDao(partner);
  }

  async getAll(): Promise<PartnerDao[]> {
    const partners = await this.client.queryArray(
      `SELECT p.id, p.trading_name, p.owner_name, p."document", a.id, a."type", a.coordinates, ca.id, ca."type", ca.coordinates FROM partner p
      INNER JOIN address a ON a.partner_id = p.id 
      INNER JOIN coverage_area ca ON ca.partner_id = p.id;`,
    );
    return transformInPartnerDaoArray(partners);
  }

  async save(partner: PartnerDao): Promise<void> {
    const savedPartner = await this.client.queryArray(
      `INSERT INTO partner (trading_name, owner_name, document)
      VALUES ($1, $2, $3)
      RETURNING id;`,
      [
        partner.tradingName,
        partner.ownerName,
        partner.document,
      ],
    );
    const partnerId = savedPartner.rows[0][0];
    await this.client.queryArray(
      `INSERT INTO address (type, coordinates, partner_id)
      VALUES ($1, $2, $3)
      RETURNING id;`,
      [
        partner.address.type,
        partner.address.coordinates,
        partnerId,
      ],
    );
    await this.client.queryArray(
      `INSERT INTO coverage_area (type, coordinates, partner_id)
      VALUES ($1, $2, $3)
      RETURNING id;`,
      [
        partner.coverageArea.type,
        partner.coverageArea.coordinates,
        partnerId,
      ],
    );
  }
}

function transformDataToPartnerDao(data: any[]): PartnerDao {
  const adrCoordinates = data[6].map((value: string) => Number(value));
    const coverageCoordinates = data[9].map((item1: any[]) => {
      return item1.map((item2: any[]) => {
        return item2.map((item3: any[]) => {
          return item3.map((item4) => Number(item4));
        });
      });
    });
    const partnerDao: PartnerDao = {
      id: data[0],
      tradingName: data[1],
      ownerName: data[2],
      document: data[3],
      address: {
        id: data[4],
        type: data[5],
        coordinates: adrCoordinates,
      },
      coverageArea: {
        id: data[7],
        type: data[8],
        coordinates: coverageCoordinates,
      },
    };
    return partnerDao;
}

function transformInPartnerDaoArray(data: any): PartnerDao[] {
  return data.rows.map((partner: any[]) => {
    return transformDataToPartnerDao(partner)
  });
}

function transformInPartnerDao(data: any): PartnerDao {
  const partner = data.rows[0];
  return transformDataToPartnerDao(partner)
}
