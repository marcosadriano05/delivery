import { Controller } from "../controllers/controller.ts";
import { FindNearestController } from "../controllers/partner/find_nearest.ts";
import { FindByIdController } from "../controllers/partner/find_by_id.ts";
import { FindAllController } from "../controllers/partner/find_all.ts";
import { SaveController } from "../controllers/partner/save.ts";
import { PostgresRepository } from "../infra/postgres_repository.ts";
import { GeometryWasmLib } from "../infra/geometry_wasm_lib.ts";
import { client } from "../infra/postgres.ts";

const repo = new PostgresRepository(client);
const geometryLib = new GeometryWasmLib();

export const findNearestPartner = (): Controller => {
  return new FindNearestController(repo, geometryLib);
};

export const findPartnerById = (): Controller => {
  return new FindByIdController(repo);
};

export const findAllPartners = (): Controller => {
  return new FindAllController(repo);
};

export const savePartner = (): Controller => {
  return new SaveController(repo);
};
