import { Router } from "../../deps/oak.ts";
import { oakAdapter } from "./oak_adapter.ts";
import {
  findAllPartners,
  findNearestPartner,
  findPartnerById,
  savePartner,
} from "./factory.ts";

const router = new Router();

router.get("/partner/:id", oakAdapter(findPartnerById()));
router.get("/partner", oakAdapter(findAllPartners()));
router.post("/partner", oakAdapter(savePartner()));
router.post("/partner/nearest", oakAdapter(findNearestPartner()));

export { router };
