import { Controller, HttpRequest, HttpResponse } from "../controller.ts";
import { PartnerDto, Repository } from "../../domain/repository.ts";
import { Geometry } from "../../domain/geometry.ts";
import {
  FindNearestPartner,
  FindPartnerError,
} from "../../domain/find_nearest_partner.ts";
import { badRequest, notFound, ok, serverError } from "../responses.ts";
import { ValidationError } from "../validation_error.ts";

export class FindNearestController implements Controller {
  constructor(
    private readonly repository: Repository<PartnerDto>,
    private readonly geometryLib: Geometry,
  ) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      validateParams(req.body);
      const service = new FindNearestPartner(this.repository, this.geometryLib);
      const partner = await service.exec(req.body.lat, req.body.lon);
      return ok(partner);
    } catch (error) {
      if (error instanceof FindPartnerError) {
        return notFound(error.message);
      }
      if (error instanceof ValidationError) {
        return badRequest(error.message);
      }
      return serverError(error);
    }
  }
}

function validateParams(body: any): void {
  if (body === undefined || Object.keys(body).length === 0) {
    throw new ValidationError("Body params missing: lat, lon.");
  }
  if (body.lon === undefined) {
    throw new ValidationError("Body params missing: lon.");
  }
  if (body.lat === undefined) {
    throw new ValidationError("Body params missing: lat.");
  }
  if (typeof body.lat !== "number" || typeof body.lon !== "number") {
    throw new ValidationError("Body params lat and lon must be numbers.");
  }
}
