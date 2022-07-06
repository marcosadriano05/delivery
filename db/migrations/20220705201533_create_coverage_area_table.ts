import {
  AbstractMigration,
  ClientPostgreSQL,
  Info,
} from "../../deps/nessie.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(info: Info): Promise<void> {
    await this.client.queryArray(
      `CREATE TABLE coverage_area (
        id INT GENERATED ALWAYS AS IDENTITY,
        type TEXT,
        coordinates REAL[][][][],
        partner_id INT,
        PRIMARY KEY (id),
        CONSTRAINT fk_partner
        FOREIGN KEY (partner_id) 
        REFERENCES partner (id)
        ON DELETE CASCADE
		  );`,
    );
  }

  /** Runs on rollback */
  async down(info: Info): Promise<void> {
    await this.client.queryArray("DROP TABLE coverage_area;");
  }
}
