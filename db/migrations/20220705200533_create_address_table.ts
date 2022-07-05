import { AbstractMigration, ClientPostgreSQL, Info } from "../../deps.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(info: Info): Promise<void> {
    await this.client.queryArray(`CREATE TABLE address (
			id INT GENERATED ALWAYS AS IDENTITY,
			type TEXT,
            coordinates TEXT,
            partner_id INT,
			PRIMARY KEY (id),
            CONSTRAINT fk_partner
            FOREIGN KEY (partner_id) 
            REFERENCES partner (id)
            ON DELETE CASCADE
		);`);
  }

  /** Runs on rollback */
  async down(info: Info): Promise<void> {
    await this.client.queryArray("DROP TABLE address;");
  }
}