import { Controller, HttpRequest, HttpResponse } from "../controller.ts";
import { PartnerDto, Repository } from "../../domain/repository.ts";
import { FindNearestPartner } from "../../domain/find_nearest_partner.ts";
import { badRequest, ok, serverError } from "../responses.ts";

export class FindNearestController implements Controller {
  constructor(
    private readonly repository: Repository<PartnerDto>,
  ) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      if (req.body === undefined || Object.keys(req.body).length === 0) {
        return badRequest("Body params missing: lat, lon.");
      }
      const body = req.body;
      if (body.lon === undefined) {
        return badRequest("Body params missing: lon.");
      }
      if (body.lat === undefined) {
        return badRequest("Body params missing: lat.");
      }
      if (typeof body.lat !== "number" || typeof body.lon !== "number") {
        return badRequest("Body params lat and lon must be numbers.");
      }
      const service = new FindNearestPartner(this.repository);
      const partner = await service.exec(body.lat, body.lon);
      return ok(partner);
    } catch (error) {
      return serverError(error.message);
    }
  }
}
