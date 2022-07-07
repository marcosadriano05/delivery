import { Router } from "../../deps/opine.ts";
import { client } from "../infra/postgres.ts";
import { PostgresRepository } from "../infra/postgres_repository.ts";
import { FindNearestPartner } from "../domain/find_nearest_partner.ts";

const router = Router();
const repo = new PostgresRepository(client);

router.get("/partner/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const partner = await repo.getById(Number(id));
    res.setStatus(200).json(partner);
  } catch (_error) {
    res.setStatus(404).json({ message: "Partner not found." })
  }
});

router.get("/partner", async (_req, res) => {
  try {
    const partners = await repo.getAll();
    res.setStatus(200).json(partners);
  } catch (_error) {
    res.setStatus(500).json({ message: "Server error." })
  }
});

router.post("/partner", async (req, res) => {
  try {
    const body = req.body;
    await repo.save(body);
    res.setStatus(201).json({ message: "Partner created." });
  } catch (_error) {
    res.setStatus(500).json({ message: "Error to create partner." })
  }
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
