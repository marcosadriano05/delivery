import { Router } from "../../deps/opine.ts";
import { opineAdapter } from "./opine_adapter.ts";
import {
  findAllPartners,
  findNearestPartner,
  findPartnerById,
  savePartner,
} from "./factory.ts";

const router = Router();

router.get("/partner/:id", opineAdapter(findPartnerById()));
router.get("/partner", opineAdapter(findAllPartners()));
router.post("/partner", opineAdapter(savePartner()));
router.post("/partner/nearest", opineAdapter(findNearestPartner()));

export { router };
