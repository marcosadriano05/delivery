import { AbstractMigration, ClientPostgreSQL, Info } from "../../deps.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(info: Info): Promise<void> {
    await this.client.queryArray(`CREATE TABLE partner (
			id INT GENERATED ALWAYS AS IDENTITY,
			trading_name TEXT,
            owner_name TEXT,
            document TEXT,
			PRIMARY KEY (id)
		);`);
  }

  /** Runs on rollback */
  async down(info: Info): Promise<void> {
    await this.client.queryArray("DROP TABLE partner;");
  }
}
