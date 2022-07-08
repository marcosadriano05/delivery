import { Controller, HttpRequest, HttpResponse } from "../controller.ts";
import { PartnerDto, Repository } from "../../domain/repository.ts";
import { badRequest, notFound, ok, serverError } from "../responses.ts";

export class FindByIdController implements Controller {
  constructor(
    private readonly repository: Repository<PartnerDto>,
  ) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const id = req.params.id;
      if (isNaN(Number(id))) {
        return badRequest("Id param should have a number format.");
      }
      const partner = await this.repository.getById(Number(id));
      if (!partner) {
        return notFound("Partner not found.");
      }
      return ok(partner);
    } catch (_error) {
      return serverError("Server error.");
    }
  }
}
