import { Controller, HttpRequest, HttpResponse } from "../controller.ts";
import { PartnerDto, Repository } from "../../domain/repository.ts";
import { FindNearestPartner } from "../../domain/find_nearest_partner.ts";

export class FindNearestController implements Controller {
  constructor(
    private readonly repository: Repository<PartnerDto>,
  ) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const body = req.body;
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
