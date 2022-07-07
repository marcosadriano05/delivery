import { Controller, HttpRequest, HttpResponse } from "../controller.ts";
import { PartnerDto, Repository } from "../../domain/repository.ts";
import { FindNearestPartner } from "../../domain/find_nearest_partner.ts";

export class FindNearestController implements Controller {
  constructor(
    private readonly repository: Repository<PartnerDto>,
  ) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      if (req.body === undefined) {
        return {
          statusCode: 400,
          body: { message: "Body params missing: lat, lon." },
        };
      }
      const body = req.body;
      if (body.lon === undefined) {
        return {
          statusCode: 400,
          body: { message: "Body params missing: lon." },
        };
      }
      if (body.lat === undefined) {
        return {
          statusCode: 400,
          body: { message: "Body params missing: lat." },
        };
      }
      if (typeof body.lat !== "number" && typeof body.lon !== "number") {
        return {
          statusCode: 400,
          body: { message: "Body params lat and lon must be numbers." },
        };
      }
      const service = new FindNearestPartner(this.repository);
      const partner = await service.exec(body.lat, body.lon);
      return {
        statusCode: 200,
        body: partner,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: {
          message: error.message,
        },
      };
    }
  }
}
