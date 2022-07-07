import { Controller, HttpRequest, HttpResponse } from "../controller.ts";
import { PartnerDto, Repository } from "../../domain/repository.ts";

export class FindByIdController implements Controller {
  constructor(
    private readonly repository: Repository<PartnerDto>,
  ) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const id = req.params.id;
      const partner = await this.repository.getById(Number(id));
      return {
        statusCode: 200,
        body: partner,
      };
    } catch (_error) {
      return { statusCode: 404, body: { message: "Partner not found." } };
    }
  }
}
