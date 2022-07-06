import { Router } from "../../deps/opine.ts";
import { client } from "../infra/postgres.ts";
import { PostgresRepository } from "../infra/postgres_repository.ts";
import { FindNearestPartner } from "../domain/find_nearest_partner.ts";

const router = Router();
const repo = new PostgresRepository(client);

router.get("/partner/:id", async (req, res) => {
  const id = req.params.id;
  const partner = await repo.getById(Number(id));
  res.setStatus(200).json(partner);
});

router.get("/partner", async (_req, res) => {
  const partners = await repo.getAll();
  res.setStatus(200).json(partners);
});

router.post("/partner", async (req, res) => {
  const body = req.body;
  await repo.save(body);
  res.setStatus(201).json({ message: "Partner created." });
});

router.post("/partner/nearest", async (req, res) => {
  try {
    const body = req.body;
    const service = new FindNearestPartner(repo);
    const partner = await service.exec(body.lat, body.lon);
    res.setStatus(200).json(partner);
  } catch (error) {
    res.setStatus(500).json({ message: error.message });
  }
});

export { router };
