// deno-lint-ignore-file no-explicit-any
import { PartnerDto, Repository } from "../domain/repository.ts";
import pg from "pg";

export class PostgresRepository implements Repository<PartnerDto> {
  constructor(
    private readonly client: pg.Client,
  ) {}

  async getById(id: number): Promise<PartnerDto | null> {
    const query = {
      text:
        `SELECT p.id, p.trading_name, p.owner_name, p."document", a.id, a."type", a.coordinates, ca.id, ca."type", ca.coordinates FROM partner p
      INNER JOIN address a ON a.partner_id = p.id 
      INNER JOIN coverage_area ca ON ca.partner_id = p.id
      WHERE p.id = $1;`,
      values: [id],
      rowMode: "array",
    };
    const partner = await this.client.query(query);
    if (partner.rows.length === 0) {
      return null;
    }
    return transformInPartnerDto(partner);
  }

  async getAll(): Promise<PartnerDto[]> {
    const query = {
      text:
        `SELECT p.id, p.trading_name, p.owner_name, p."document", a.id, a."type", a.coordinates, ca.id, ca."type", ca.coordinates FROM partner p
      INNER JOIN address a ON a.partner_id = p.id 
      INNER JOIN coverage_area ca ON ca.partner_id = p.id;`,
      rowMode: "array",
    };
    const partners = await this.client.query(query);
    return transformInPartnerDtoArray(partners);
  }

  async save(data: PartnerDto): Promise<void> {
    const queryToSavePartner = {
      text: `INSERT INTO partner (trading_name, owner_name, document)
      VALUES ($1, $2, $3)
      RETURNING id;`,
      values: [
        data.tradingName,
        data.ownerName,
        data.document,
      ],
      rowMode: "array",
    };
    const savedPartner = await this.client.query(queryToSavePartner);
    const partnerId = savedPartner.rows[0][0];
    const queryToSaveAddress = {
      text: `INSERT INTO address (type, coordinates, partner_id)
      VALUES ($1, $2, $3)
      RETURNING id;`,
      values: [
        data.address.type,
        data.address.coordinates,
        partnerId,
      ],
      rowMode: "array",
    };
    await this.client.query(queryToSaveAddress);

    const queryToSaveCoverageArea = {
      text: `INSERT INTO coverage_area (type, coordinates, partner_id)
      VALUES ($1, $2, $3)
      RETURNING id;`,
      values: [
        data.coverageArea.type,
        data.coverageArea.coordinates,
        partnerId,
      ],
      rowMode: "array",
    };
    await this.client.query(queryToSaveCoverageArea);
  }
}

function transformDataToPartnerDto(data: any[]): PartnerDto {
  const adrCoordinates = data[6].map((value: string) => Number(value));
  const coverageCoordinates = data[9].map((item1: any[]) => {
    return item1.map((item2: any[]) => {
      return item2.map((item3: any[]) => {
        return item3.map((item4) => Number(item4));
      });
    });
  });
  const partnerDto: PartnerDto = {
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
  return partnerDto;
}

function transformInPartnerDtoArray(data: any): PartnerDto[] {
  return data.rows.map((partner: any[]) => {
    return transformDataToPartnerDto(partner);
  });
}

function transformInPartnerDto(data: any): PartnerDto {
  const partner = data.rows[0];
  return transformDataToPartnerDto(partner);
}
