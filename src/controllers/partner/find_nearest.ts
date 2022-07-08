import { Controller, HttpRequest, HttpResponse } from "../controller.ts";
import { PartnerDto, Repository } from "../../domain/repository.ts";
import { Geometry } from "../../domain/geometry.ts";
import {
  FindNearestPartner,
  FindPartnerError,
} from "../../domain/find_nearest_partner.ts";
import { badRequest, notFound, ok, serverError } from "../responses.ts";

export class FindNearestController implements Controller {
  constructor(
    private readonly repository: Repository<PartnerDto>,
    private readonly geometryLib: Geometry,
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
      const service = new FindNearestPartner(this.repository, this.geometryLib);
      const partner = await service.exec(body.lat, body.lon);
      return ok(partner);
    } catch (error) {
      if (error instanceof FindPartnerError) {
        return notFound(error.message);
      }
      return serverError(error);
    }
  }
}
