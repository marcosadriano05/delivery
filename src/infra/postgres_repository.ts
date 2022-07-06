import { PartnerDao, PartnerRepository } from "../domain/partner_repository.ts";
import { Client } from "../../deps/postgres.ts";

export class PostgresRepository implements PartnerRepository {
  constructor(
    private readonly client: Client,
  ) {}

  getAll(): Promise<PartnerDao[]> {
    throw new Error("Method not implemented.");
  }

  async save(partner: PartnerDao): Promise<void> {
    const savedPartner = await this.client.queryArray(
      `INSERT INTO partner (
        trading_name,
        owner_name,
        document
      ) VALUES (
        $1,
        $2,
        $3
      ) RETURNING id;`,
      [
        partner.tradingName,
        partner.ownerName,
        partner.document,
      ],
    );
    const partnerId = savedPartner.rows[0][0];
    await this.client.queryArray(
      `INSERT INTO address (
        type,
        coordinates,
        partner_id
      ) VALUES (
        $1,
        $2,
        $3
      ) RETURNING id;`,
      [
        partner.address.type,
        partner.address.coordinates,
        partnerId,
      ],
    );
    await this.client.queryArray(
      `INSERT INTO coverage_area (
        type,
        coordinates,
        partner_id
      ) VALUES (
        $1,
        $2,
        $3
      ) RETURNING id;`,
      [
        partner.coverageArea.type,
        partner.coverageArea.coordinates,
        partnerId,
      ],
    );
  }
}
