import { Controller, HttpRequest, HttpResponse } from "../controller.ts";
import { PartnerDto, Repository } from "../../domain/repository.ts";
import { notFound, ok } from "../responses.ts";
import { responseFromError } from "../error_handle.ts";

export class FindAllController implements Controller {
  constructor(
    private readonly repository: Repository<PartnerDto>,
  ) {}

  async handle(_req: HttpRequest): Promise<HttpResponse> {
    try {
      const partners = await this.repository.getAll();
      if (partners.length === 0) {
        return notFound("No partners found.");
      }
      return ok(partners);
    } catch (error) {
      return responseFromError(error as Error);
    }
  }
}
