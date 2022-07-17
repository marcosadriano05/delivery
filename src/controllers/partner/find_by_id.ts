import { Controller, HttpRequest, HttpResponse } from "../controller.ts";
import { PartnerDto, Repository } from "../../domain/repository.ts";
import { badRequest, notFound, ok, serverError } from "../responses.ts";
import { ValidationError } from "../validation_error.ts";

export class FindByIdController implements Controller {
  constructor(
    private readonly repository: Repository<PartnerDto>,
  ) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      validateParams(req);
      const id = req.params.id;
      const partner = await this.repository.getById(Number(id));
      if (!partner) {
        return notFound("Partner not found.");
      }
      return ok(partner);
    } catch (error) {
      if (error instanceof ValidationError) {
        return badRequest(error.message);
      }
      return serverError(error);
    }
  }
}

function validateParams(req: HttpRequest): void {
  const id = req.params.id;
  if (isNaN(Number(id))) {
    throw new ValidationError("Id param should have a number format.");
  }
}
